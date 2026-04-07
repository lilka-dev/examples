# CMake toolchain file for Xtensa ESP32-S3
set(CMAKE_SYSTEM_NAME Generic)
set(CMAKE_SYSTEM_PROCESSOR xtensa)

if(DEFINED ENV{XTENSA_TOOLCHAIN_PATH})
    set(_TOOLCHAIN_DIR "$ENV{XTENSA_TOOLCHAIN_PATH}")
elseif(EXISTS "$ENV{HOME}/.platformio/packages/toolchain-xtensa-esp32s3/bin/xtensa-esp32s3-elf-gcc")
    set(_TOOLCHAIN_DIR "$ENV{HOME}/.platformio/packages/toolchain-xtensa-esp32s3/bin")
else()
    set(_TOOLCHAIN_DIR "")
endif()

if(_TOOLCHAIN_DIR)
    set(_CROSS "${_TOOLCHAIN_DIR}/xtensa-esp32s3-elf-")
else()
    set(_CROSS "xtensa-esp32s3-elf-")
endif()

set(CMAKE_C_COMPILER   "${_CROSS}gcc")
set(CMAKE_CXX_COMPILER "${_CROSS}g++")
set(CMAKE_ASM_COMPILER "${_CROSS}gcc")
set(CMAKE_AR           "${_CROSS}ar")
set(CMAKE_RANLIB       "${_CROSS}ranlib")
set(CMAKE_STRIP        "${_CROSS}strip")
set(CMAKE_OBJDUMP      "${_CROSS}objdump")
set(CMAKE_SIZE         "${_CROSS}size")
set(CMAKE_OBJCOPY      "${_CROSS}objcopy")

set(CMAKE_C_COMPILER_WORKS   1)
set(CMAKE_CXX_COMPILER_WORKS 1)

set(CMAKE_FIND_ROOT_PATH_MODE_PROGRAM NEVER)
set(CMAKE_FIND_ROOT_PATH_MODE_LIBRARY ONLY)
set(CMAKE_FIND_ROOT_PATH_MODE_INCLUDE ONLY)
