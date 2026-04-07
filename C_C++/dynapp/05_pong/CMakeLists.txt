# CMakeLists.txt — Keira DynApp Pong Game
cmake_minimum_required(VERSION 3.16)
project(pong_game C)

set(SOURCES main.c)
set(OUTPUT_NAME pong.so)

set(DYNAPP_C_FLAGS
    -c -fPIC -Os -Wall -Wextra -nostdlib -std=gnu11
    -fdata-sections -ffunction-sections -fvisibility=hidden
)

set(DYNAPP_LINK_FLAGS
    -shared -fPIC -nostdlib -nostartfiles -static-libgcc
    -e app_main
    -fdata-sections -ffunction-sections
    -Wl,--gc-sections
    -fvisibility=hidden
    -Wl,--strip-all -Wl,--strip-debug
    -Wl,--allow-shlib-undefined
)

set(OBJECTS "")
foreach(SRC ${SOURCES})
    get_filename_component(OBJ_NAME ${SRC} NAME_WE)
    set(OBJ_FILE "${CMAKE_CURRENT_BINARY_DIR}/${OBJ_NAME}.o")
    add_custom_command(
        OUTPUT ${OBJ_FILE}
        COMMAND ${CMAKE_C_COMPILER} ${DYNAPP_C_FLAGS} -I${CMAKE_CURRENT_SOURCE_DIR}
                -o ${OBJ_FILE} ${CMAKE_CURRENT_SOURCE_DIR}/${SRC}
        DEPENDS ${CMAKE_CURRENT_SOURCE_DIR}/${SRC}
        COMMENT "Compiling ${SRC}"
    )
    list(APPEND OBJECTS ${OBJ_FILE})
endforeach()

add_custom_command(
    OUTPUT ${OUTPUT_NAME}
    COMMAND ${CMAKE_C_COMPILER} ${DYNAPP_LINK_FLAGS} -o ${OUTPUT_NAME} ${OBJECTS}
    DEPENDS ${OBJECTS}
    COMMENT "Linking ${OUTPUT_NAME}"
)

add_custom_target(${PROJECT_NAME} ALL
    DEPENDS ${OUTPUT_NAME}
    COMMAND ${CMAKE_SIZE} -A -d ${OUTPUT_NAME}
    COMMENT "Build complete: ${OUTPUT_NAME}"
)
