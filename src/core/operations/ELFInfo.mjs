/**
 * @author n1073645 [n1073645@gmail.com]
 * @copyright Crown Copyright 2022
 * @license Apache-2.0
 */

import Operation from "../Operation.mjs";
import Stream from "../lib/Stream.mjs";
import Utils from "../Utils.mjs";
import OperationError from "../errors/OperationError.mjs";

/**
 * ELF Info operation
 */
class ELFInfo extends Operation {

    /**
     * ELFInfo constructor
     */
    constructor() {
        super();

        this.name = "ELF 信息";
        this.module = "Default";
        this.description = "实现类似 readelf 的功能。此操作将提取 ELF 文件的 ELF 头、程序头、节头和符号表。";
        this.infoURL = "https://www.wikipedia.org/wiki/Executable_and_Linkable_Format";
        this.inputType = "ArrayBuffer";
        this.outputType = "string";
        this.args = [];
    }

    /**
     * @param {ArrayBuffer} input
     * @param {Object[]} args
     * @returns {string}
     */
    run(input, args) {
        let phoff = 0;
        let phEntries = 0;
        let shoff = 0;
        let shEntries = 0;
        let shentSize = 0;
        let entry = 0;
        let format = 0;
        let endianness = "";
        let shstrtab = 0;

        let namesOffset = 0;

        let symtabOffset = 0;
        let symtabSize = 0;
        let symtabEntSize = 0;

        let strtabOffset = 0;
        const align = 30;

        /**
         * This function reads characters until it hits a null terminator.
         *
         * @param {stream} stream
         * @param {integer} namesOffset
         * @param {integer} nameOffset
         * @returns {string}
         */
        function readString(stream, namesOffset, nameOffset) {
            const preMove = stream.position;
            stream.moveTo(namesOffset + nameOffset);

            const nameResult = stream.readString();
            stream.moveTo(preMove);
            return nameResult;
        }

        /**
         * This function parses and extracts relevant information from the ELF Header.
         *
         * @param {stream} stream
         * @returns {string}
         */
        function elfHeader(stream) {
            /**
             * The ELF Header is comprised of the following structures depending on the binary's format.
             *
             * e_ident     - The Magic Number 0x7F,0x45,0x4c,0x46
             *             - Byte set to 1 or 2 to signify 32 位 or 64 位 format, respectively.
             *             - Byte set to 1 or 2 to signify little of big endianness, respectively.
             *             - Byte set to 1 for the version of ELF.
             *             - Byte identifying the target OS ABI.
             *             - Byte further identifying the OS ABI Version.
             *             - 7 Padding Bytes.
             * e_type      - 2 bytes identifying the object file type.
             * e_machine   - 2 bytes identifying the instruction set architecture.
             * e_version   - Byte set to 1 for the version of ELF.
             *
             * 32 位:
             *      e_entry     - 4 Bytes specifying the entry point.
             *      e_phoff     - 4 Bytes specifying the offset of the Program Header Table.
             *      e_shoff     - 4 Bytes specifying the offset of the Section Header Table.
             *
             * 64 位:
             *      e_entry     - 8 Bytes specifying the entry point.
             *      e_phoff     - 8 Bytes specifying the offset of the Program Header Table.
             *      e_shoff     - 8 Bytes specifying the offset of the Section Header Table.
             *
             * e_flags     - 4 Bytes specifying processor specific flags.
             * e_ehsize    - 2 Bytes specifying the size of the ELF Header.
             * e_phentsize - 2 Bytes specifying the size of a Program Header Table Entry.
             * e_phnum     - 2 Bytes specifying the number of entries in the Program Header Table.
             * e_shentsize - 2 Bytes specifying the size of a Section Header Table Entry.
             * e_shnum     - 2 Bytes specifying the number of entries in the Section Header Table.
             * e_shstrndx  - 2 Bytes specifying the index of the section containing the section names in the Section Header Table.
             */
            const ehResult = [];

            const magic = stream.getBytes(4);
            if (magic.join("") !== [0x7f, 0x45, 0x4c, 0x46].join(""))
                throw new OperationError("无效的 ELF 文件");

            ehResult.push("魔数:".padEnd(align) + `${Utils.byteArrayToChars(magic)}`);

            format = stream.readInt(1);
            ehResult.push("格式:".padEnd(align) + `${format === 1 ? "32 位" : "64 位"}`);

            endianness = stream.readInt(1) === 1 ? "le" : "be";
            ehResult.push("字节序:".padEnd(align) + `${endianness === "le" ? "小端" : "大端"}`);

            ehResult.push("版本:".padEnd(align) + `${stream.readInt(1).toString()}`);

            let ABI = "";
            switch (stream.readInt(1)) {
                case 0x00:
                    ABI = "System V";
                    break;
                case 0x01:
                    ABI = "HP-UX";
                    break;
                case 0x02:
                    ABI = "NetBSD";
                    break;
                case 0x03:
                    ABI = "Linux";
                    break;
                case 0x04:
                    ABI = "GNU Hurd";
                    break;
                case 0x06:
                    ABI = "Solaris";
                    break;
                case 0x07:
                    ABI = "AIX";
                    break;
                case 0x08:
                    ABI = "IRIX";
                    break;
                case 0x09:
                    ABI = "FreeBSD";
                    break;
                case 0x0A:
                    ABI = "Tru64";
                    break;
                case 0x0B:
                    ABI = "Novell Modesto";
                    break;
                case 0x0C:
                    ABI = "OpenBSD";
                    break;
                case 0x0D:
                    ABI = "OpenVMS";
                    break;
                case 0x0E:
                    ABI = "NonStop Kernel";
                    break;
                case 0x0F:
                    ABI = "AROS";
                    break;
                case 0x10:
                    ABI = "Fenix OS";
                    break;
                case 0x11:
                    ABI = "CloudABI";
                    break;
                case 0x12:
                    ABI = "Stratus Technologies OpenVOS(斯特拉图斯 OpenVOS)";
                    break;
                default:
                    break;
            }
            ehResult.push("ABI:".padEnd(align) + ABI);

            // Linux Kernel does not use ABI Version.
            const abiVersion = stream.readInt(1).toString();
            if (ABI !== "Linux")
                ehResult.push("ABI 版本:".padEnd(align) + abiVersion);

            stream.moveForwardsBy(7);

            let eType = "";
            switch (stream.readInt(2, endianness)) {
                case 0x0000:
                    eType = "Unknown";
                    break;
                case 0x0001:
                    eType = "可重定位文件";
                    break;
                case 0x0002:
                    eType = "可执行文件";
                    break;
                case 0x0003:
                    eType = "共享对象";
                    break;
                case 0x0004:
                    eType = "核心转储文件";
                    break;
                case 0xFE00:
                    eType = "LOOS";
                    break;
                case 0xFEFF:
                    eType = "HIOS";
                    break;
                case 0xFF00:
                    eType = "LOPROC";
                    break;
                case 0xFFFF:
                    eType = "HIPROC";
                    break;
                default:
                    break;
            }
            ehResult.push("类型:".padEnd(align) + eType);

            let ISA = "";
            switch (stream.readInt(2, endianness)) {
                case 0x0000:
                    ISA = "未指定指令集";
                    break;
                case 0x0001:
                    ISA = "AT&T WE 32100";
                    break;
                case 0x0002:
                    ISA = "SPARC";
                    break;
                case 0x0003:
                    ISA = "x86";
                    break;
                case 0x0004:
                    ISA = "Motorola 68000 (M68k)";
                    break;
                case 0x0005:
                    ISA = "Motorola 88000 (M88k)";
                    break;
                case 0x0006:
                    ISA = "Intel MCU";
                    break;
                case 0x0007:
                    ISA = "Intel 80860";
                    break;
                case 0x0008:
                    ISA = "MIPS";
                    break;
                case 0x0009:
                    ISA = "IBM System/370";
                    break;
                case 0x000A:
                    ISA = "MIPS RS3000 Little-endian";
                    break;
                case 0x000B:
                case 0x000C:
                case 0x000D:
                case 0x000E:
                case 0x0018:
                case 0x0019:
                case 0x001A:
                case 0x001B:
                case 0x001C:
                case 0x001D:
                case 0x001E:
                case 0x001F:
                case 0x0020:
                case 0x0021:
                case 0x0022:
                case 0x0023:
                    ISA = "保留供将来使用";
                    break;
                case 0x000F:
                    ISA = "Hewlett-Packard PA-RISC";
                    break;
                case 0x0011:
                    ISA = "Fujitsu VPP500";
                    break;
                case 0x0012:
                    ISA = "Enhanced instruction set SPARC";
                    break;
                case 0x0013:
                    ISA = "Intel 80960";
                    break;
                case 0x0014:
                    ISA = "PowerPC";
                    break;
                case 0x0015:
                    ISA = "PowerPC (64 位)";
                    break;
                case 0x0016:
                    ISA = "S390, including S390";
                    break;
                case 0x0017:
                    ISA = "IBM SPU/SPC";
                    break;
                case 0x0024:
                    ISA = "NEC V800";
                    break;
                case 0x0025:
                    ISA = "Fujitsu FR20";
                    break;
                case 0x0026:
                    ISA = "TRW RH-32";
                    break;
                case 0x0027:
                    ISA = "Motorola RCE";
                    break;
                case 0x0028:
                    ISA = "ARM (up to ARMv7/Aarch32)";
                    break;
                case 0x0029:
                    ISA = "Digital Alpha";
                    break;
                case 0x002A:
                    ISA = "SuperH";
                    break;
                case 0x002B:
                    ISA = "SPARC Version 9";
                    break;
                case 0x002C:
                    ISA = "Siemens TriCore embedded processor";
                    break;
                case 0x002D:
                    ISA = "Argonaut RISC 核心";
                    break;
                case 0x002E:
                    ISA = "Hitachi H8/300";
                    break;
                case 0x002F:
                    ISA = "Hitachi H8/300H";
                    break;
                case 0x0030:
                    ISA = "Hitachi H8S";
                    break;
                case 0x0031:
                    ISA = "Hitachi H8/500";
                    break;
                case 0x0032:
                    ISA = "IA-64";
                    break;
                case 0x0033:
                    ISA = "Standford MIPS-X";
                    break;
                case 0x0034:
                    ISA = "Motorola ColdFire";
                    break;
                case 0x0035:
                    ISA = "Motorola M68HC12";
                    break;
                case 0x0036:
                    ISA = "富士通 MMA 多媒体加速器";
                    break;
                case 0x0037:
                    ISA = "Siemens PCP";
                    break;
                case 0x0038:
                    ISA = "Sony nCPU embedded RISC processor";
                    break;
                case 0x0039:
                    ISA = "Denso NDR1 microprocessor";
                    break;
                case 0x003A:
                    ISA = "Motorola Star*Core processor";
                    break;
                case 0x003B:
                    ISA = "Toyota ME16 processor";
                    break;
                case 0x003C:
                    ISA = "STMicroelectronics ST100 processor";
                    break;
                case 0x003D:
                    ISA = "Advanced Logic Corp. TinyJ embedded processor family";
                    break;
                case 0x003E:
                    ISA = "AMD x86-64";
                    break;
                case 0x003F:
                    ISA = "索尼 DSP 处理器";
                    break;
                case 0x0040:
                    ISA = "Digital Equipment Corp. PDP-10";
                    break;
                case 0x0041:
                    ISA = "Digital Equipment Corp. PDP-11";
                    break;
                case 0x0042:
                    ISA = "Siemens FX66 microcontroller";
                    break;
                case 0x0043:
                    ISA = "STMicroelectronics ST9+ 8/16 bit microcontroller";
                    break;
                case 0x0044:
                    ISA = "STMicroelectronics ST7 8-bit microcontroller";
                    break;
                case 0x0045:
                    ISA = "Motorola MC68HC16 Microcontroller";
                    break;
                case 0x0046:
                    ISA = "Motorola MC68HC11 Microcontroller";
                    break;
                case 0x0047:
                    ISA = "Motorola MC68HC08 Microcontroller";
                    break;
                case 0x0048:
                    ISA = "Motorola MC68HC05 Microcontroller";
                    break;
                case 0x0049:
                    ISA = "Silicon Graphics SVx";
                    break;
                case 0x004A:
                    ISA = "STMicroelectronics ST19 8-bit microcontroller";
                    break;
                case 0x004B:
                    ISA = "Digital VAX";
                    break;
                case 0x004C:
                    ISA = "Axis Communications 32 位 embedded processor";
                    break;
                case 0x004D:
                    ISA = "Infineon Technologies 32 位 embedded processor";
                    break;
                case 0x004E:
                    ISA = "Element 14 64 位 DSP Processor";
                    break;
                case 0x004F:
                    ISA = "LSI Logic 16-bit DSP Processor";
                    break;
                case 0x0050:
                    ISA = "Donald Knuth's educational 64 位 processor";
                    break;
                case 0x0051:
                    ISA = "Harvard University machine-independent object files";
                    break;
                case 0x0052:
                    ISA = "SiTera Prism";
                    break;
                case 0x0053:
                    ISA = "Atmel AVR 8-bit microcontroller";
                    break;
                case 0x0054:
                    ISA = "Fujitsu FR30";
                    break;
                case 0x0055:
                    ISA = "Mitsubishi D10V";
                    break;
                case 0x0056:
                    ISA = "Mitsubishi D30V";
                    break;
                case 0x0057:
                    ISA = "NEC v850";
                    break;
                case 0x0058:
                    ISA = "Mitsubishi M32R";
                    break;
                case 0x0059:
                    ISA = "Matsushita MN10300";
                    break;
                case 0x005A:
                    ISA = "Matsushita MN10200";
                    break;
                case 0x005B:
                    ISA = "picoJava";
                    break;
                case 0x005C:
                    ISA = "OpenRISC 32 位 embedded processor";
                    break;
                case 0x005D:
                    ISA = "ARC Cores Tangent-A5";
                    break;
                case 0x005E:
                    ISA = "Tensilica Xtensa 架构";
                    break;
                case 0x005F:
                    ISA = "Alphamosaic VideoCore 处理器";
                    break;
                case 0x0060:
                    ISA = "Thompson Multimedia 通用处理器";
                    break;
                case 0x0061:
                    ISA = "National Semiconductor 32000 series";
                    break;
                case 0x0062:
                    ISA = "Tenor Network TPC 处理器";
                    break;
                case 0x0063:
                    ISA = "Trebia SNP 1000 processor";
                    break;
                case 0x0064:
                    ISA = "STMicroelectronics (www.st.com) ST200 microcontroller";
                    break;
                case 0x008C:
                    ISA = "TMS320C6000 Family";
                    break;
                case 0x00AF:
                    ISA = "MCST Elbrus e2k";
                    break;
                case 0x00B7:
                    ISA = "ARM 64 位 (ARMv8/Aarch64)";
                    break;
                case 0x00F3:
                    ISA = "RISC-V";
                    break;
                case 0x00F7:
                    ISA = "伯克利包过滤器";
                    break;
                case 0x0101:
                    ISA = "WDC 65C816";
                    break;
                default:
                    ISA = "Unimplemented";
                    break;
            }
            ehResult.push("指令集架构:".padEnd(align) + ISA);

            ehResult.push("ELF 版本:".padEnd(align) + `${stream.readInt(4, endianness)}`);

            const readSize = format === 1 ? 4 : 8;
            entry = stream.readInt(readSize, endianness);
            phoff = stream.readInt(readSize, endianness);
            shoff = stream.readInt(readSize, endianness);
            ehResult.push("入口点:".padEnd(align) + `0x${Utils.hex(entry)}`);
            ehResult.push("程序头偏移(PHOFF):".padEnd(align) + `0x${Utils.hex(phoff)}`);
            ehResult.push("节头偏移(SHOFF):".padEnd(align) + `0x${Utils.hex(shoff)}`);

            const flags = stream.readInt(4, endianness);
            ehResult.push("标志:".padEnd(align) + `${Utils.bin(flags)}`);

            ehResult.push("ELF 头大小:".padEnd(align) + `${stream.readInt(2, endianness)} 字节`);
            ehResult.push("程序头大小:".padEnd(align) + `${stream.readInt(2, endianness)} 字节`);
            phEntries = stream.readInt(2, endianness);
            ehResult.push("程序头项数:".padEnd(align) + phEntries);
            shentSize = stream.readInt(2, endianness);
            ehResult.push("节头大小:".padEnd(align) + shentSize + " 字节");
            shEntries = stream.readInt(2, endianness);
            ehResult.push("节头项数:".padEnd(align) + shEntries);
            shstrtab = stream.readInt(2, endianness);
            ehResult.push("节名字符串表:".padEnd(align) + shstrtab);

            return ehResult.join("\n");
        }

        /**
         * This function parses and extracts relevant information from a Program Header.
         *
         * @param {stream} stream
         * @returns {string}
         */
        function programHeader(stream) {
            /**
             * A Program Header is comprised of the following structures depending on the binary's format.
             *
             * p_type       - 4 Bytes identifying the type of the segment.
             *
             * 32 位:
             *      p_offset    - 4 Bytes specifying the offset of the segment.
             *      p_vaddr     - 4 Bytes specifying the virtual address of the segment in memory.
             *      p_paddr     - 4 Bytes specifying the physical address of the segment in memory.
             *      p_filesz    - 4 Bytes specifying the size in bytes of the segment in the file image.
             *      p_memsz     - 4 Bytes specifying the size in bytes of the segment in memory.
             *      p_flags     - 4 Bytes identifying the segment dependent flags.
             *      p_align     - 4 Bytes set to 0 or 1 for alignment or no alignment, respectively.
             *
             * 64 位:
             *      p_flags     - 4 Bytes identifying segment dependent flags.
             *      p_offset    - 8 Bytes specifying the offset of the segment.
             *      p_vaddr     - 8 Bytes specifying the virtual address of the segment in memory.
             *      p_paddr     - 8 Bytes specifying the physical address of the segment in memory.
             *      p_filesz    - 8 Bytes specifying the size in bytes of the segment in the file image.
             *      p_memsz     - 8 Bytes specifying the size in bytes of the segment in memory.
             *      p_align     - 8 Bytes set to 0 or 1 for alignment or no alignment, respectively.
             */

            /**
             * This function decodes the flags bitmask for the Program Header.
             *
             * @param {integer} flags
             * @returns {string}
             */
            function readFlags(flags) {
                const result = [];
                if (flags & 0x1)
                    result.push("执行");
                if (flags & 0x2)
                    result.push("写入");
                if (flags & 0x4)
                    result.push("读取");
                if (flags &  0xf0000000)
                    result.push("未指定");
                return result.join(",");
            }

            const phResult = [];

            let pType = "";
            const programHeaderType = stream.readInt(4, endianness);
            switch (true) {
                case (programHeaderType === 0x00000000):
                    pType = "未使用";
                    break;
                case (programHeaderType === 0x00000001):
                    pType = "可加载段";
                    break;
                case (programHeaderType === 0x00000002):
                    pType = "动态链接信息";
                    break;
                case (programHeaderType === 0x00000003):
                    pType = "解释器信息";
                    break;
                case (programHeaderType === 0x00000004):
                    pType = "辅助信息";
                    break;
                case (programHeaderType === 0x00000005):
                    pType = "保留";
                    break;
                case (programHeaderType === 0x00000006):
                    pType = "程序头表";
                    break;
                case (programHeaderType === 0x00000007):
                    pType = "线程局部存储模板";
                    break;
                case (programHeaderType >= 0x60000000 && programHeaderType <= 0x6FFFFFFF):
                    pType = "保留区间（操作系统专用）";
                    break;
                case (programHeaderType >= 0x70000000 && programHeaderType <= 0x7FFFFFFF):
                    pType = "保留区间（处理器专用）";
                    break;
                default:
                    break;

            }
            phResult.push("程序头类型:".padEnd(align) + pType);

            if (format === 2)
                phResult.push("标志:".padEnd(align) + readFlags(stream.readInt(4, endianness)));

            const readSize = format === 1? 4 : 8;
            phResult.push("段偏移:".padEnd(align) + `${stream.readInt(readSize, endianness)}`);
            phResult.push("段虚拟地址:".padEnd(align) + `${stream.readInt(readSize, endianness)}`);
            phResult.push("段物理地址:".padEnd(align) + `${stream.readInt(readSize, endianness)}`);
            phResult.push("段大小:".padEnd(align) + `${stream.readInt(readSize, endianness)} 字节`);
            phResult.push("内存中段大小:".padEnd(align) + `${stream.readInt(readSize, endianness)} 字节`);

            if (format === 1)
                phResult.push("标志:".padEnd(align) + readFlags(stream.readInt(4, endianness)));

            stream.moveForwardsBy(readSize);

            return phResult.join("\n");
        }

        /**
         * This function parses and extracts relevant information from a Section Header.
         *
         * @param {stream} stream
         * @returns {string}
         */
        function sectionHeader(stream) {
            /**
             * A Section Header is comprised of the following structures depending on the binary's format.
             *
             * sh_name      - 4 Bytes identifying the offset into the .shstrtab for the name of this section.
             * sh_type      - 4 Bytes identifying the type of this header.
             *
             * 32 位:
             *      sh_flags        - 4 Bytes identifying section specific flags.
             *      sh_addr         - 4 Bytes identifying the virtual address of the section in memory.
             *      sh_offset       - 4 Bytes identifying the offset of the section in the file.
             *      sh_size         - 4 Bytes specifying the size in bytes of the section in the file image.
             *      sh_link         - 4 Bytes identifying the index of an associated section.
             *      sh_info         - 4 Bytes specifying extra information about the section.
             *      sh_addralign    - 4 Bytes containing the alignment for the section.
             *      sh_entsize      - 4 Bytes specifying the size, in bytes, of each entry in the section.
             *
             * 64 位:
             *      sh_flags        - 8 Bytes identifying section specific flags.
             *      sh_addr         - 8 Bytes identifying the virtual address of the section in memory.
             *      sh_offset       - 8 Bytes identifying the offset of the section in the file.
             *      sh_size         - 8 Bytes specifying the size in bytes of the section in the file image.
             *      sh_link         - 4 Bytes identifying the index of an associated section.
             *      sh_info         - 4 Bytes specifying extra information about the section.
             *      sh_addralign    - 8 Bytes containing the alignment for the section.
             *      sh_entsize      - 8 Bytes specifying the size, in bytes, of each entry in the section.
             */
            const shResult = [];

            const nameOffset = stream.readInt(4, endianness);
            let type = "";
            const shType = stream.readInt(4, endianness);
            switch (true) {
                case (shType === 0x00000001):
                    type = "程序数据";
                    break;
                case (shType === 0x00000002):
                    type = "符号表";
                    break;
                case (shType === 0x00000003):
                    type = "字符串表";
                    break;
                case (shType === 0x00000004):
                    type = "带附加的重定位项";
                    break;
                case (shType === 0x00000005):
                    type = "符号哈希表";
                    break;
                case (shType === 0x00000006):
                    type = "动态链接信息";
                    break;
                case (shType === 0x00000007):
                    type = "注释";
                    break;
                case (shType === 0x00000008):
                    type = "无数据的程序空间";
                    break;
                case (shType === 0x00000009):
                    type = "无附加的重定位项";
                    break;
                case (shType === 0x0000000A):
                    type = "保留";
                    break;
                case (shType === 0x0000000B):
                    type = "动态链接器符号表";
                    break;
                case (shType === 0x0000000E):
                    type = "构造函数数组";
                    break;
                case (shType === 0x0000000F):
                    type = "析构函数数组";
                    break;
                case (shType === 0x00000010):
                    type = "预构造函数数组";
                    break;
                case (shType === 0x00000011):
                    type = "节组";
                    break;
                case (shType === 0x00000012):
                    type = "扩展节索引";
                    break;
                case (shType === 0x00000013):
                    type = "已定义类型数量";
                    break;
                case (shType >= 0x60000000 && shType <= 0x6fffffff):
                    type = "操作系统专用";
                    break;
                case (shType >= 0x70000000 && shType <= 0x7fffffff):
                    type = "处理器专用";
                    break;
                case (shType >= 0x80000000 && shType <= 0x8fffffff):
                    type = "应用程序专用";
                    break;
                default:
                    type = "未使用";
                    break;
            }

            shResult.push("类型:".padEnd(align) + type);

            let nameResult = "";
            if (type !== "未使用") {
                nameResult = readString(stream, namesOffset, nameOffset);
                shResult.push("节名称: ".padEnd(align) + nameResult);
            }

            const readSize = (format === 1) ? 4 : 8;

            const flags = stream.readInt(readSize, endianness);
            const shFlags = [];
            const bitMasks = [
                [0x00000001, "Writable"],
                [0x00000002, "Alloc"],
                [0x00000004, "Executable"],
                [0x00000010, "Merge"],
                [0x00000020, "字符串"],
                [0x00000040, "SHT 信息链接"],
                [0x00000080, "链接顺序"],
                [0x00000100, "操作系统特定处理"],
                [0x00000200, "组"],
                [0x00000400, "线程局部数据"],
                [0x0FF00000, "OS-Specific"],
                [0xF0000000, "Processor Specific"],
                [0x04000000, "Special Ordering (Solaris)"],
                [0x08000000, "Excluded (Solaris)"]
            ];
            bitMasks.forEach(elem => {
                if (flags & elem[0])
                    shFlags.push(elem[1]);
            });
            shResult.push("标志:".padEnd(align) + shFlags);

            const vaddr = stream.readInt(readSize, endianness);
            shResult.push("节内存虚拟地址:".padEnd(align) + vaddr);

            const shoffset = stream.readInt(readSize, endianness);
            shResult.push("节偏移:".padEnd(align) + shoffset);

            const secSize = stream.readInt(readSize, endianness);
            shResult.push("节大小:".padEnd(align) + secSize);

            const associatedSection = stream.readInt(4, endianness);
            shResult.push("关联节:".padEnd(align) + associatedSection);

            const extraInfo = stream.readInt(4, endianness);
            shResult.push("节附加信息:".padEnd(align) + extraInfo);

            // Jump over alignment field.
            stream.moveForwardsBy(readSize);
            const entSize = stream.readInt(readSize, endianness);
            switch (nameResult) {
                case ".strtab":
                    strtabOffset = shoffset;
                    break;
                case ".symtab":
                    symtabOffset = shoffset;
                    symtabSize = secSize;
                    symtabEntSize = entSize;
                    break;
                default:
                    break;
            }
            return shResult.join("\n");
        }

        /**
         * This function returns the offset of the Section Header Names Section.
         *
         * @param {stream} stream
         */
        function getNamesOffset(stream) {
            const preMove = stream.position;
            stream.moveTo(shoff + (shentSize * shstrtab));
            if (format === 1) {
                stream.moveForwardsBy(0x10);
                namesOffset = stream.readInt(4, endianness);
            } else {
                stream.moveForwardsBy(0x18);
                namesOffset = stream.readInt(8, endianness);
            }
            stream.position = preMove;
        }

        /**
         * This function returns a symbol's name from the string table.
         *
         * @param {stream} stream
         * @returns {string}
         */
        function getSymbols(stream) {
            /**
             * The Symbol Table is comprised of Symbol Table Entries whose structure depends on the binary's format.
             *
             * 32 位:
             *      st_name         - 4 Bytes specifying an index in the files symbol string table.
             *      st_value        - 4 Bytes identifying the value associated with the symbol.
             *      st_size         - 4 Bytes specifying the size associated with the symbol (this is not the size of the symbol).
             *      st_info         - A byte specifying the type and binding of the symbol.
             *      st_other        - A byte specifying the symbol's visibility.
             *      st_shndx        - 2 Bytes identifying the section that this symbol is related to.
             *
             * 64 位:
             *      st_name         - 4 Bytes specifying an index in the files symbol string table.
             *      st_info         - A byte specifying the type and binding of the symbol.
             *      st_other        - A byte specifying the symbol's visibility.
             *      st_shndx        - 2 Bytes identifying the section that this symbol is related to.
             *      st_value        - 8 Bytes identifying the value associated with the symbol.
             *      st_size         - 8 Bytes specifying the size associated with the symbol (this is not the size of the symbol).
             */
            const nameOffset = stream.readInt(4, endianness);
            stream.moveForwardsBy(format === 2 ? 20 : 12);
            return readString(stream, strtabOffset, nameOffset);
        }

        input = new Uint8Array(input);
        const stream = new Stream(input);
        const result = ["=".repeat(align) + " ELF 头部 " + "=".repeat(align)];
        result.push(elfHeader(stream) + "\n");

        getNamesOffset(stream);

        result.push("=".repeat(align) + " 程序头 " + "=".repeat(align));
        stream.moveTo(phoff);
        for (let i = 0; i < phEntries; i++)
            result.push(programHeader(stream) + "\n");

        result.push("=".repeat(align) + " 节头 " + "=".repeat(align));
        stream.moveTo(shoff);
        for (let i = 0; i < shEntries; i++)
            result.push(sectionHeader(stream) + "\n");

        result.push("=".repeat(align) + " 符号表 " + "=".repeat(align));

        stream.moveTo(symtabOffset);
        let elem = "";
        for (let i = 0; i < (symtabSize / symtabEntSize); i++)
            if ((elem = getSymbols(stream)) !== "")
                result.push("符号名称:".padEnd(align) + elem);

        return result.join("\n");
    }

}

export default ELFInfo;
