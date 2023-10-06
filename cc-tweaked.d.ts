/** @noSelfInFile */
/// <reference path="./node_modules/@typescript-to-lua/language-extensions/index.d.ts" />
/**
    Functions in the global environment, defined in bios.lua. This does not
    include standard Lua functions.
    
    [Documentation](https://tweaked.cc/module/_G.html)
*/
//declare namespace _G {
/**
    Pauses execution for the specified number of seconds.
    
    As it waits for a fixed amount of world ticks, time will automatically be
    rounded up to the nearest multiple of 0.05 seconds. If you are using coroutines
    or the parallel API, it will only pause execution of the current
    thread, not the whole program.
    
    tipBecause sleep internally uses timers, it is a function that yields. This means
    that you can use it to prevent "Too long without yielding" errors. However, as
    the minimum sleep time is 0.05 seconds, it will slow your program down.
    
    
    ⚠ warningInternally, this function queues and waits for a timer event (using
    os.startTimer), however it does not listen for any other events. This means
    that any event that occurs while sleeping will be entirely discarded. If you
    need to receive events while sleeping, consider using timers,
    or the parallel API.
    
    
    @param time The number of seconds to sleep for, rounded up to the
    nearest multiple of 0.05.
*/
declare function sleep(time: number): void

/**
    Writes a line of text to the screen without a newline at the end, wrapping
    text if necessary.
    
    @param text The text to write to the string
    
    @returns The number of lines written
*/
declare function write(text: string): number

/**
    Prints the specified values to the screen separated by spaces, wrapping if
    necessary. After printing, the cursor is moved to the next line.
    
    @param ... The values to print on the screen
    
    @returns The number of lines written
*/
declare function print(..._: /*not provided*/ any[]): number

/**
    Prints the specified values to the screen in red, separated by spaces,
    wrapping if necessary. After printing, the cursor is moved to the next line.
    
    @param ... The values to print on the screen
*/
declare function printError(..._: /*not provided*/ any[]): void

/**
    Reads user input from the terminal. This automatically handles arrow keys,
    pasting, character replacement, history scrollback, auto-completion, and
    default values.
    
    @param replaceChar? A character to replace each typed character with.
    This can be used for hiding passwords, for example.
    @param history? A table holding history items that can be scrolled
    back to with the up/down arrow keys. The oldest item is at index 1, while the
    newest item is at the highest index.
    @param completeFn? A function
    to be used for completion. This function should take the partial text typed so
    far, and returns a list of possible completion options.
    @param __default? Default text which should already be entered into
    the prompt.
    
    @returns The text typed in.
*/
declare function read(replaceChar?: string, history?: object, completeFn?: (partial: string) => string[] | null, __default?: string): string

/**
    Stores the current ComputerCraft and Minecraft versions.
    
    Outside of Minecraft (for instance, in an emulator) _HOST will contain the
    emulator's version instead.
    
    For example, ComputerCraft 1.93.0 (Minecraft 1.15.2).
*/
declare const _HOST: any

/**
    The default computer settings as defined in the ComputerCraft
    configuration.
    
    This is a comma-separated list of settings pairs defined by the mod
    configuration or server owner. By default, it is empty.
    
    An example value to disable autocompletion:
    
    shell.autocomplete=false,lua.autocomplete=false,edit.autocomplete=false
*/
declare const _CC_DEFAULT_SETTINGS: any

//}
/**
    Constants and functions for colour values, suitable for working with
    term and redstone.
    
    [Documentation](https://tweaked.cc/module/colors.html)
*/
declare namespace colors {
    /**
        White: Written as 0 in paint files and term.blit, has a default
        terminal colour of #F0F0F0.
    */
    export const white = 0x1

    /**
        Orange: Written as 1 in paint files and term.blit, has a
        default terminal colour of #F2B233.
    */
    export const orange = 0x2

    /**
        Magenta: Written as 2 in paint files and term.blit, has a
        default terminal colour of #E57FD8.
    */
    export const magenta = 0x4

    /**
        Light blue: Written as 3 in paint files and term.blit, has a
        default terminal colour of #99B2F2.
    */
    export const lightBlue = 0x8

    /**
        Yellow: Written as 4 in paint files and term.blit, has a
        default terminal colour of #DEDE6C.
    */
    export const yellow = 0x10

    /**
        Lime: Written as 5 in paint files and term.blit, has a default
        terminal colour of #7FCC19.
    */
    export const lime = 0x20

    /**
        Pink: Written as 6 in paint files and term.blit, has a default
        terminal colour of #F2B2CC.
    */
    export const pink = 0x40

    /**
        Gray: Written as 7 in paint files and term.blit, has a default
        terminal colour of #4C4C4C.
    */
    export const gray = 0x80

    /**
        Light gray: Written as 8 in paint files and term.blit, has a
        default terminal colour of #999999.
    */
    export const lightGray = 0x100

    /**
        Cyan: Written as 9 in paint files and term.blit, has a default
        terminal colour of #4C99B2.
    */
    export const cyan = 0x200

    /**
        Purple: Written as a in paint files and term.blit, has a
        default terminal colour of #B266E5.
    */
    export const purple = 0x400

    /**
        Blue: Written as b in paint files and term.blit, has a default
        terminal colour of #3366CC.
    */
    export const blue = 0x800

    /**
        Brown: Written as c in paint files and term.blit, has a default
        terminal colour of #7F664C.
    */
    export const brown = 0x1000

    /**
        Green: Written as d in paint files and term.blit, has a default
        terminal colour of #57A64E.
    */
    export const green = 0x2000

    /**
        Red: Written as e in paint files and term.blit, has a default
        terminal colour of #CC4C4C.
    */
    export const red = 0x4000

    /**
        Black: Written as f in paint files and term.blit, has a default
        terminal colour of #111111.
    */
    export const black = 0x8000

    /**
        Combines a set of colors (or sets of colors) into a larger set. Useful for
        Bundled Cables.
        
        @param ... The colors to combine.
        
        @returns The union of the color sets given in ...
    */
    export function combine(..._: number[]): number

    /**
        Removes one or more colors (or sets of colors) from an initial set. Useful
        for Bundled Cables.
        
        Each parameter beyond the first may be a single color or may be a set of
        colors (in the latter case, all colors in the set are removed from the
        original set).
        
        @param colors The color from which to subtract.
        @param ... The colors to subtract.
        
        @returns The resulting color.
    */
    export function subtract(colors: number, ..._: number[]): number

    /**
        Tests whether color is contained within colors. Useful for Bundled
        Cables.
        
        @param colors A color, or color set
        @param color A color or set of colors that colors should contain.
        
        @returns If colors contains all colors within color.
    */
    export function test(colors: number, color: number): boolean

    /**
        Combine a three-colour RGB value into one hexadecimal representation.
        
        @param r The red channel, should be between 0 and 1.
        @param g The green channel, should be between 0 and 1.
        @param b The blue channel, should be between 0 and 1.
        
        @returns The combined hexadecimal colour.
    */
    export function packRGB(r: number, g: number, b: number): number

    /**
        Separate a hexadecimal RGB colour into its three constituent channels.
        
        @param rgb The combined hexadecimal colour.
        
        @returns The red channel, will be between 0 and 1.
        @returns The green channel, will be between 0 and 1.
        @returns The blue channel, will be between 0 and 1.
    */
    export function unpackRGB(rgb: number): LuaMultiReturn<[number, number, number]>

    /**
        🛈 DeprecatedUse packRGB or unpackRGB directly.
        
        
        Either calls colors.packRGB or colors.unpackRGB, depending on how many
        arguments it receives.
        
        @param r The red channel, as an argument to colors.packRGB.
        @param g The green channel, as an argument to colors.packRGB.
        @param b The blue channel, as an argument to colors.packRGB.
        
        @returns The combined hexadecimal colour, as returned by colors.packRGB.
    */
    export function rgb8(r: number, g: number, b: number): number

    /**
        Converts the given color to a paint/blit hex character (0-9a-f).
        
        This is equivalent to converting floor(log_2(color)) to hexadecimal.
        
        @param color The color to convert.
        
        @returns The blit hex code of the color.
    */
    export function toBlit(color: number): string

    /**
        Converts the given paint/blit hex character (0-9a-f) to a color.
        
        This is equivalent to converting the hex character to a number and then 2 ^ decimal
        
        @param hex The paint/blit hex character to convert
        
        @returns The color
    */
    export function fromBlit(hex: string): number

}
/**
    An alternative version of colors for lovers of British spelling.
    
    [Documentation](https://tweaked.cc/module/colours.html)
*/
declare namespace colours {
    /**
        Grey. Written as 7 in paint files and term.blit, has a default
        terminal colour of #4C4C4C.
    */
    export const grey: any

    /**
        Light grey. Written as 8 in paint files and term.blit, has a
        default terminal colour of #999999.
    */
    export const lightGrey: any

}
/**
    Execute Minecraft commands and gather data from the results from
    a command computer.
    
    [Documentation](https://tweaked.cc/module/commands.html)
*/
declare namespace commands {
    /**
        Execute a specific command.
        
        @param command The command to execute.
        
        @returns Whether the command executed successfully.
        @returns The output of this command, as a list of lines.
        @returns The number of "affected" objects, or nil if the command failed. The definition of this
        varies from command to command.
    */
    export function exec(command: string): LuaMultiReturn<[boolean, string[], number | null]>

    /**
        Asynchronously execute a command.
        
        Unlike exec, this will immediately return, instead of waiting for the
        command to execute. This allows you to run multiple commands at the same
        time.
        
        When this command has finished executing, it will queue a task_complete
        event containing the result of executing this command (what exec would
        return).
        
        @param command The command to execute.
        
        @returns The "task id". When this command has been executed, it will queue a task_complete event with a matching id.
    */
    export function execAsync(command: string): number

    /**
        List all available commands which the computer has permission to execute.
        
        @param ... The sub-command to complete.
        
        @returns A list of all available commands
    */
    export function list(..._: string[]): string[]

    /**
        Get the position of the current command computer.
        
        
        @returns This computer's x position.
        @returns This computer's y position.
        @returns This computer's z position.
    */
    export function getBlockPosition(): LuaMultiReturn<[number, number, number]>

    /**
        Get information about a range of blocks.
        
        This returns the same information as getBlockInfo, just for multiple
        blocks at once.
        
        Blocks are traversed by ascending y level, followed by z and x - the returned
        table may be indexed using x + z*width + y*depth*depth.
        
        @param minX The start x coordinate of the range to query.
        @param minY The start y coordinate of the range to query.
        @param minZ The start z coordinate of the range to query.
        @param maxX The end x coordinate of the range to query.
        @param maxY The end y coordinate of the range to query.
        @param maxZ The end z coordinate of the range to query.
        @param dimension? The dimension to query (e.g. "minecraft:overworld"). Defaults to the current dimension.
        
        @returns A list of information about each block.
        
        @throws If the coordinates are not within the world.
        If trying to get information about more than 4096 blocks.
    */
    export function getBlockInfos(minX: number, minY: number, minZ: number, maxX: number, maxY: number, maxZ: number, dimension?: string): object[]

    /**
        Get some basic information about a block.
        
        The returned table contains the current name, metadata and block state (as
        with turtle.inspect). If there is a tile entity for that block, its NBT
        will also be returned.
        
        @param x The x position of the block to query.
        @param y The y position of the block to query.
        @param z The z position of the block to query.
        @param dimension? The dimension to query (e.g. "minecraft:overworld"). Defaults to the current dimension.
        
        @returns The given block's information.
        
        @throws If the coordinates are not within the world, or are not currently loaded.
    */
    export function getBlockInfo(x: number, y: number, z: number, dimension?: string): object

    /**
        The builtin commands API, without any generated command helper functions
        
        This may be useful if a built-in function (such as commands.list) has been
        overwritten by a command.
    */
    export const native: any

    /**
        A table containing asynchronous wrappers for all commands.
        
        As with commands.execAsync, this returns the "task id" of the enqueued
        command.
    */
    export const async: any

}
/**
    Interact with disk drives.
    
    [Documentation](https://tweaked.cc/module/disk.html)
*/
declare namespace disk {
    /**
        Checks whether any item at all is in the disk drive
        
        @param name The name of the disk drive.
        
        @returns If something is in the disk drive.
    */
    export function isPresent(name: string): boolean

    /**
        Get the label of the floppy disk, record, or other media within the given
        disk drive.
        
        If there is a computer or turtle within the drive, this will set the label as
        read by os.getComputerLabel.
        
        @param name The name of the disk drive.
        
        @returns The name of the current media, or nil if the drive is
        not present or empty.
    */
    export function getLabel(name: string): string | null

    /**
        Set the label of the floppy disk or other media
        
        @param name The name of the disk drive.
        @param label The new label of the disk
    */
    export function setLabel(name: string, label: string | null): void

    /**
        Check whether the current disk provides a mount.
        
        This will return true for disks and computers, but not records.
        
        @param name The name of the disk drive.
        
        @returns If the disk is present and provides a mount.
    */
    export function hasData(name: string): boolean

    /**
        Find the directory name on the local computer where the contents of the
        current floppy disk (or other mount) can be found.
        
        @param name The name of the disk drive.
        
        @returns The mount's directory, or nil if the drive does not
        contain a floppy or computer.
    */
    export function getMountPath(name: string): string | null

    /**
        Whether the current disk is a music disk as opposed to a floppy disk
        or other item.
        
        If this returns true, you will can play the record.
        
        @param name The name of the disk drive.
        
        @returns If the disk is present and has audio saved on it.
    */
    export function hasAudio(name: string): boolean

    /**
        Get the title of the audio track from the music record in the drive.
        
        This generally returns the same as disk.getLabel for records.
        
        @param name The name of the disk drive.
        
        @returns The track title, false if there is not a music
        record in the drive or nil if no drive is present.
    */
    export function getAudioTitle(name: string): string | false | null

    /**
        Starts playing the music record in the drive.
        
        If any record is already playing on any disk drive, it stops before the
        target drive starts playing. The record stops when it reaches the end of the
        track, when it is removed from the drive, when disk.stopAudio is called, or
        when another record is started.
        
        @param name The name of the disk drive.
    */
    export function playAudio(name: string): void

    /**
        Stops the music record in the drive from playing, if it was started with
        disk.playAudio.
        
        @param name The name o the disk drive.
    */
    export function stopAudio(name: string): void

    /**
        Ejects any item currently in the drive, spilling it into the world as a loose item.
        
        @param name The name of the disk drive.
    */
    export function eject(name: string): void

    /**
        Returns a number which uniquely identifies the disk in the drive.
        
        Note, unlike disk.getLabel, this does not return anything for other media,
        such as computers or turtles.
        
        @param name The name of the disk drive.
        
        @returns The disk ID, or nil if the drive does not contain a floppy disk.
    */
    export function getID(name: string): string | null

}
/**
    Interact with the computer's files and filesystem, allowing you to manipulate files, directories and paths. This
    includes:
    
    [Documentation](https://tweaked.cc/module/fs.html)
*/
declare namespace fs {
    /**
        Provides completion for a file or directory name, suitable for use with
        _G.read.
        
        When a directory is a possible candidate for completion, two entries are
        included - one with a trailing slash (indicating that entries within this
        directory exist) and one without it (meaning this entry is an immediate
        completion candidate). include_dirs can be set to false to only include
        those with a trailing slash.
        
        @param path The path to complete.
        @param location The location where paths are resolved from.
        @param include_files? = true When false, only directories will
        be included in the returned list.
        @param include_dirs? = true When false, "raw" directories will
        not be included in the returned list.
        
        @returns A list of possible completion candidates.
    */
    export function complete(path: string, location: string, include_files?: boolean, include_dirs?: boolean): string[]

    /**
        Searches for files matching a string with wildcards.
        
        This string looks like a normal path string, but can include wildcards, which
        can match multiple paths:
        
        
        "?" matches any single character in a file name.
        "*" matches any number of characters.
        
        
        For example, rom/&#42;/command* will look for any path starting with command
        inside any subdirectory of /rom.
        
        Note that these wildcards match a single segment of the path. For instance
        rom/*.lua will include rom/startup.lua but not include rom/programs/list.lua.
        
        @param path The wildcard-qualified path to search for.
        
        @returns A list of paths that match the search string.
        
        @throws If the supplied path was invalid.
    */
    export function find(path: string): string[]

    /**
        Returns true if a path is mounted to the parent filesystem.
        
        The root filesystem "/" is considered a mount, along with disk folders and
        the rom folder. Other programs (such as network shares) can exstend this to
        make other mount types by correctly assigning their return value for getDrive.
        
        @param path The path to check.
        
        @returns If the path is mounted, rather than a normal file/folder.
        
        @throws If the path does not exist.
    */
    export function isDriveRoot(path: string): boolean

    /**
        Returns a list of files in a directory.
        
        @param path The path to list.
        
        @returns A table with a list of files in the directory.
        
        @throws If the path doesn't exist.
    */
    export function list(path: string): string[]

    /**
        Combines several parts of a path into one full path, adding separators as
        needed.
        
        @param path The first part of the path. For example, a parent directory path.
        @param ... Additional parts of the path to combine.
        
        @returns The new path, with separators added between parts as needed.
        
        @throws On argument errors.
    */
    export function combine(path: string, ..._: string[]): string

    /**
        Returns the file name portion of a path.
        
        @param path The path to get the name from.
        
        @returns The final part of the path (the file name).
    */
    export function getName(path: string): string

    /**
        Returns the parent directory portion of a path.
        
        @param path The path to get the directory from.
        
        @returns The path with the final part removed (the parent directory).
    */
    export function getDir(path: string): string

    /**
        Returns the size of the specified file.
        
        @param path The file to get the file size of.
        
        @returns The size of the file, in bytes.
        
        @throws If the path doesn't exist.
    */
    export function getSize(path: string): number

    /**
        Returns whether the specified path exists.
        
        @param path The path to check the existence of.
        
        @returns Whether the path exists.
    */
    export function exists(path: string): boolean

    /**
        Returns whether the specified path is a directory.
        
        @param path The path to check.
        
        @returns Whether the path is a directory.
    */
    export function isDir(path: string): boolean

    /**
        Returns whether a path is read-only.
        
        @param path The path to check.
        
        @returns Whether the path cannot be written to.
    */
    export function isReadOnly(path: string): boolean

    /**
        Creates a directory, and any missing parents, at the specified path.
        
        @param path The path to the directory to create.
        
        @throws If the directory couldn't be created.
    */
    export function makeDir(path: string): void

    /**
        Moves a file or directory from one path to another.
        
        Any parent directories are created as needed.
        
        @param path The current file or directory to move from.
        @param dest The destination path for the file or directory.
        
        @throws If the file or directory couldn't be moved.
    */
    export function move(path: string, dest: string): void

    /**
        Copies a file or directory to a new path.
        
        Any parent directories are created as needed.
        
        @param path The file or directory to copy.
        @param dest The path to the destination file or directory.
        
        @throws If the file or directory couldn't be copied.
    */
    export function copy(path: string, dest: string): void

    /**
        Deletes a file or directory.
        
        If the path points to a directory, all of the enclosed files and
        subdirectories are also deleted.
        
        @param path The path to the file or directory to delete.
        
        @throws If the file or directory couldn't be deleted.
    */
    function __reserved__delete(path: string): void

    /**
        Opens a file for reading or writing at a path.
        
        The mode string can be any of the following:
        
        
        "r": Read mode
        "w": Write mode
        "a": Append mode
        
        
        The mode may also have a "b" at the end, which opens the file in "binary
        mode". This allows you to read binary files, as well as seek within a file.
        
        @param path The path to the file to open.
        @param mode The mode to open the file with.
        
        @returns A file handle object for the file.
        
        @throws If an invalid mode was specified.
    */
    export function open(path: string, mode: string): object

    /**
        Returns the name of the mount that the specified path is located on.
        
        @param path The path to get the drive of.
        
        @returns The name of the drive that the file is on; e.g. hdd for local files, or rom for ROM files.
        
        @throws If the path doesn't exist.
    */
    export function getDrive(path: string): string | null

    /**
        Returns the amount of free space available on the drive the path is
        located on.
        
        @param path The path to check the free space for.
        
        @returns The amount of free space available, in bytes, or "unlimited".
        
        @throws If the path doesn't exist.
    */
    export function getFreeSpace(path: string): number | "unlimited"

    /**
        Returns the capacity of the drive the path is located on.
        
        @param path The path of the drive to get.
        
        @returns This drive's capacity. This will be nil for "read-only" drives, such as the ROM or
        treasure disks.
        
        @throws If the capacity cannot be determined.
    */
    export function getCapacity(path: string): number | null

    /**
        Get attributes about a specific file or folder.
        
        The returned attributes table contains information about the size of the file, whether it is a directory,
        when it was created and last modified, and whether it is read only.
        
        The creation and modification times are given as the number of milliseconds since the UNIX epoch. This may be
        given to os.date in order to convert it to more usable form.
        
        @param path The path to get attributes for.
        
        @returns The resulting attributes.
        
        @throws If the path does not exist.
    */
    export function attributes(path: string): { size: number, isDir: boolean, isReadOnly: boolean, created: number, modified: number }

    /**
        A file handle opened with fs.open with the "rb"
        mode.
    */
    export interface BinaryReadHandle {
        /**
            Read a number of bytes from this file.
            
            @param count? The number of bytes to read. When absent, a single byte will be read as a number. This
            may be 0 to determine we are at the end of the file.
            
            @returns If we are at the end of the file.
            
            @throws When trying to read a negative number of bytes.
            If the file has been closed.
        */
        read(count?: number): null

        /**
            Read the remainder of the file.
            
            
            @returns The remaining contents of the file, or nil if we are at the end.
            
            @throws If the file has been closed.
        */
        readAll(): string | null

        /**
            Read a line from the file.
            
            @param withTrailing? Whether to include the newline characters with the returned string. Defaults to false.
            
            @returns The read line or nil if at the end of the file.
            
            @throws If the file has been closed.
        */
        readLine(withTrailing?: boolean): string | null

        /**
            Seek to a new position within the file, changing where bytes are written to. The new position is an offset
            given by offset, relative to a start position determined by whence:
            
            
            "set": offset is relative to the beginning of the file.
            "cur": Relative to the current position. This is the default.
            "end": Relative to the end of the file.
            
            
            In case of success, seek returns the new file position from the beginning of the file.
            
            @param whence? Where the offset is relative to.
            @param offset? The offset to seek to.
            
            @returns The new position.
            
            @throws If the file has been closed.
        */
        seek(whence?: string, offset?: number): number

        /**
            Close this file, freeing any resources it uses.
            
            Once a file is closed it may no longer be read or written to.
            
            
            @throws If the file has already been closed.
        */
        close(): void

    }

    /**
        A file handle opened with fs.open with the "r"
        mode.
    */
    export interface ReadHandle {
        /**
            Read a line from the file.
            
            @param withTrailing? Whether to include the newline characters with the returned string. Defaults to false.
            
            @returns The read line or nil if at the end of the file.
            
            @throws If the file has been closed.
        */
        readLine(withTrailing?: boolean): string | null

        /**
            Read the remainder of the file.
            
            
            @returns The remaining contents of the file, or nil if we are at the end.
            
            @throws If the file has been closed.
        */
        readAll(): null | string

        /**
            Read a number of characters from this file.
            
            @param count? The number of characters to read, defaulting to 1.
            
            @returns The read characters, or nil if at the of the file.
            
            @throws When trying to read a negative number of characters.
            If the file has been closed.
        */
        read(count?: number): string | null

        /**
            Close this file, freeing any resources it uses.
            
            Once a file is closed it may no longer be read or written to.
            
            
            @throws If the file has already been closed.
        */
        close(): void

    }

    /**
        A file handle opened by fs.open using the "w" or "a" modes.
    */
    export interface WriteHandle {
        /**
            Write a string of characters to the file.
            
            @param text The text to write to the file.
            
            @throws If the file has been closed.
        */
        write(text: string): void

        /**
            Write a string of characters to the file, following them with a new line character.
            
            @param text The text to write to the file.
            
            @throws If the file has been closed.
        */
        writeLine(text: string): void

        /**
            Save the current file without closing it.
            
            
            @throws If the file has been closed.
        */
        flush(): void

        /**
            Close this file, freeing any resources it uses.
            
            Once a file is closed it may no longer be read or written to.
            
            
            @throws If the file has already been closed.
        */
        close(): void

    }

    /**
        A file handle opened by fs.open using the "wb" or "ab"
        modes.
    */
    export interface BinaryWriteHandle {
        /**
            Write a string or byte to the file.
            
            @param charcode The byte to write.
            
            @throws If the file has been closed.
        */
        write(charcode: number): void

        /**
            Save the current file without closing it.
            
            
            @throws If the file has been closed.
        */
        flush(): void

        /**
            Seek to a new position within the file, changing where bytes are written to. The new position is an offset
            given by offset, relative to a start position determined by whence:
            
            
            "set": offset is relative to the beginning of the file.
            "cur": Relative to the current position. This is the default.
            "end": Relative to the end of the file.
            
            
            In case of success, seek returns the new file position from the beginning of the file.
            
            @param whence? Where the offset is relative to.
            @param offset? The offset to seek to.
            
            @returns The new position.
            
            @throws If the file has been closed.
        */
        seek(whence?: string, offset?: number): number

        /**
            Close this file, freeing any resources it uses.
            
            Once a file is closed it may no longer be read or written to.
            
            
            @throws If the file has already been closed.
        */
        close(): void

    }

    export { __reserved__delete as delete }
}
/**
    Use modems to locate the position of the current turtle or
    computers.
    
    [Documentation](https://tweaked.cc/module/gps.html)
*/
declare namespace gps {
    /**
        The channel which GPS requests and responses are broadcast on.
    */
    export const CHANNEL_GPS = 65534

    /**
        Tries to retrieve the computer or turtles own location.
        
        @param timeout? = 2 The maximum time in seconds taken to establish our
        position.
        @param debug? = false Print debugging messages
        
        @returns This computer's x position.
        @returns This computer's y position.
        @returns This computer's z position.
    */
    export function locate(timeout?: number, debug?: boolean): LuaMultiReturn<[number, number, number]>

}
/**
    Find help files on the current computer.
    
    [Documentation](https://tweaked.cc/module/help.html)
*/
declare namespace help {
    /**
        Returns a colon-separated list of directories where help files are searched
        for. All directories are absolute.
        
        
        @returns The current help search path, separated by colons.
    */
    export function path(): string

    /**
        Sets the colon-separated list of directories where help files are searched
        for to newPath
        
        @param newPath The new path to use.
    */
    export function setPath(newPath: string): void

    /**
        Returns the location of the help file for the given topic.
        
        @param topic The topic to find
        
        @returns The path to the given topic's help file, or nil if it
        cannot be found.
    */
    export function lookup(topic: string): string | null

    /**
        Returns a list of topics that can be looked up and/or displayed.
        
        
        @returns A list of topics in alphabetical order.
    */
    export function topics(): object

    /**
        Returns a list of topic endings that match the prefix. Can be used with
        read to allow input of a help topic.
        
        @param prefix The prefix to match
        
        @returns A list of matching topics.
    */
    export function completeTopic(prefix: string): object

}
/**
    Make HTTP requests, sending and receiving data to a remote web server.
    
    [Documentation](https://tweaked.cc/module/http.html)
*/
declare namespace http {
    /**
        Make a HTTP GET request to the given url.
        
        @param url The url to request
        @param headers? Additional headers to send as part
        of this request.
        @param binary? Whether to make a binary HTTP request. If true,
        the body will not be UTF-8 encoded, and the received response will not be
        decoded.
        
        @returns The resulting http response, which can be read from.
    */
    export function get(url: string, headers?: { [index: string]: string }, binary?: boolean): Response

    /**
        Make a HTTP POST request to the given url.
        
        @param url The url to request
        @param body The body of the POST request.
        @param headers? Additional headers to send as part
        of this request.
        @param binary? Whether to make a binary HTTP request. If true,
        the body will not be UTF-8 encoded, and the received response will not be
        decoded.
        
        @returns The resulting http response, which can be read from.
    */
    export function post(url: string, body: string, headers?: { [index: string]: string }, binary?: boolean): Response

    /**
        Asynchronously make a HTTP request to the given url.
        
        This returns immediately, a http_success or http_failure will be queued
        once the request has completed.
        
        @param url The url to request
        @param body? An optional string containing the body of the
        request. If specified, a POST request will be made instead.
        @param headers? Additional headers to send as part
        of this request.
        @param binary? Whether to make a binary HTTP request. If true,
        the body will not be UTF-8 encoded, and the received response will not be
        decoded.
    */
    export function request(url: string, body?: string, headers?: { [index: string]: string }, binary?: boolean): void

    /**
        Asynchronously determine whether a URL can be requested.
        
        If this returns true, one should also listen for http_check which will
        container further information about whether the URL is allowed or not.
        
        @param url The URL to check.
        
        @returns When this url is not invalid. This does not imply that it is
        allowed - see the comment above.
    */
    export function checkURLAsync(url: string): true

    /**
        Determine whether a URL can be requested.
        
        If this returns true, one should also listen for http_check which will
        container further information about whether the URL is allowed or not.
        
        @param url The URL to check.
        
        @returns When this url is valid and can be requested via http.request.
    */
    export function checkURL(url: string): true

    /**
        Asynchronously open a websocket.
        
        This returns immediately, a websocket_success or websocket_failure
        will be queued once the request has completed.
        
        @param url The websocket url to connect to. This should have the
        ws:// or wss:// protocol.
        @param headers? Additional headers to send as part
        of the initial websocket connection.
    */
    export function websocketAsync(url: string, headers?: { [index: string]: string }): void

    /**
        Open a websocket.
        
        @param url The websocket url to connect to. This should have the
        ws:// or wss:// protocol.
        @param headers? Additional headers to send as part
        of the initial websocket connection.
        
        @returns The websocket connection.
    */
    export function websocket(url: string, headers?: { [index: string]: string }): Websocket

    /**
        A websocket, which can be used to send an receive messages with a web server.
        
        See also
        
        http.websocket On how to open a websocket.
    */
    export interface Websocket {
        /**
            Wait for a message from the server.
            
            @param timeout? The number of seconds to wait if no message is received.
            
            @returns The received message.
            @returns If this was a binary message.
            
            @throws If the websocket has been closed.
        */
        receive(timeout?: number): LuaMultiReturn<[string, boolean]>

        /**
            Send a websocket message to the connected server.
            
            @param message The message to send.
            @param binary? Whether this message should be treated as a
            
            @throws If the message is too large.
            If the websocket has been closed.
        */
        send(message: string, binary?: boolean): void

        /**
            Close this websocket. This will terminate the connection, meaning messages can no longer be sent or received
            along it.
            
        */
        close(): void

    }

    /**
        A http response. This provides the same methods as a file (or
        binary file if the request used binary mode), though provides several request specific
        methods.
        
        See also
        
        http.request On how to make a http request.
    */
    export interface Response {
        /**
            Returns the response code and response message returned by the server.
            
            
            @returns The response code (i.e. 200)
            @returns The response message (i.e. "OK")
        */
        getResponseCode(): LuaMultiReturn<[number, string]>

        /**
            Get a table containing the response's headers, in a format similar to that required by http.request.
            If multiple headers are sent with the same name, they will be combined with a comma.
            
            
            @returns The response's headers.
        */
        getResponseHeaders(): { [index: string]: string }

    }

}
/**
    Emulates Lua's standard io library.
    
    [Documentation](https://tweaked.cc/module/io.html)
*/
declare namespace io {
    /**
        A file handle representing the "standard input". Reading from this
        file will prompt the user for input.
    */
    export const stdin: any

    /**
        A file handle representing the "standard output". Writing to this
        file will display the written text to the screen.
    */
    export const stdout: any

    /**
        A file handle representing the "standard error" stream.
        
        One may use this to display error messages, writing to it will display
        them on the terminal.
    */
    export const stderr: any

    /**
        Closes the provided file handle.
        
        @param file? The file handle to close, defaults to the
        current output file.
    */
    export function close(file?: Handle): void

    /**
        Flushes the current output file.
        
    */
    export function flush(): void

    /**
        Get or set the current input file.
        
        @param file? The new input file, either as a file path or pre-existing handle.
        
        @returns The current input file.
        
        @throws If the provided filename cannot be opened for reading.
    */
    export function input(file?: Handle | string): Handle

    /**
        Opens the given file name in read mode and returns an iterator that,
        each time it is called, returns a new line from the file.
        
        This can be used in a for loop to iterate over all lines of a file
        
        Once the end of the file has been reached, nil will be returned. The file is
        automatically closed.
        
        If no file name is given, the current input will be used instead.
        In this case, the handle is not used.
        
        @param filename? The name of the file to extract lines from
        @param ... The argument to pass to Handle:read for each line.
        
        @returns The line iterator.
        
        @throws If the file cannot be opened for reading
    */
    export function lines(filename?: string, ..._: /*not provided*/ any[]): LuaIterable<string>

    /**
        Open a file with the given mode, either returning a new file handle
        or nil, plus an error message.
        
        The mode string can be any of the following:
        
        
        "r": Read mode
        "w": Write mode
        "a": Append mode
        
        
        The mode may also have a b at the end, which opens the file in "binary
        mode". This allows you to read binary files, as well as seek within a file.
        
        @param filename The name of the file to open.
        @param mode? The mode to open the file with. This defaults to rb.
        
        @returns The opened file.
    */
    export function open(filename: string, mode?: string): Handle

    /**
        Get or set the current output file.
        
        @param file? The new output file, either as a file path or pre-existing handle.
        
        @returns The current output file.
        
        @throws If the provided filename cannot be opened for writing.
    */
    export function output(file?: Handle | string): Handle

    /**
        Read from the currently opened input file.
        
        This is equivalent to io.input():read(...). See the documentation
        there for full details.
        
        @param ... The formats to read, defaulting to a whole line.
        
        @returns The data read, or nil if nothing can be read.
    */
    export function read(..._: string[]): LuaMultiReturn<(string | null)[]>

    /**
        Checks whether handle is a given file handle, and determine if it is open
        or not.
        
        @param obj The value to check
        
        @returns "file" if this is an open file, "closed file" if it
        is a closed file handle, or nil if not a file handle.
    */
    export function type(obj: /*not provided*/ any): string | null

    /**
        Write to the currently opened output file.
        
        This is equivalent to io.output():write(...). See the documentation
        there for full details.
        
        @param ... The strings to write
    */
    export function write(..._: string[]): void

    /**
        A file handle which can be read or written to.
    */
    export interface Handle {
        /**
            Close this file handle, freeing any resources it uses.
            
            
            @returns If this handle was successfully closed.
            
            @throws If this handle was already closed.
        */
        close(): true

        /**
            Flush any buffered output, forcing it to be written to the file
            
            
            @throws If the handle has been closed
        */
        flush(): void

        /**
            Returns an iterator that, each time it is called, returns a new
            line from the file.
            
            This can be used in a for loop to iterate over all lines of a file
            
            Once the end of the file has been reached, nil will be returned. The file is
            not automatically closed.
            
            @param ... The argument to pass to Handle:read for each line.
            
            @returns The line iterator.
            
            @throws If the file cannot be opened for reading
        */
        lines(..._: /*not provided*/ any[]): LuaIterable<string>

        /**
            Reads data from the file, using the specified formats. For each
            format provided, the function returns either the data read, or nil if
            no data could be read.
            
            The following formats are available:
            
            
            l: Returns the next line (without a newline on the end).
            L: Returns the next line (with a newline on the end).
            a: Returns the entire rest of the file.
            n: Returns a number (not implemented in CC).
            
            
            These formats can be preceded by a * to make it compatible with Lua 5.1.
            
            If no format is provided, l is assumed.
            
            @param ... The formats to use.
            
            @returns The data read from the file.
        */
        read(..._: /*not provided*/ any[]): LuaMultiReturn<(string | null)[]>

        /**
            Seeks the file cursor to the specified position, and returns the
            new position.
            
            whence controls where the seek operation starts, and is a string that
            may be one of these three values:
            
            
            set: base position is 0 (beginning of the file)
            cur: base is current position
            end: base is end of file
            
            
            The default value of whence is cur, and the default value of offset
            is 0. This means that file:seek() without arguments returns the current
            position without moving.
            
            @param whence? The place to set the cursor from.
            @param offset? The offset from the start to move to.
            
            @returns The new location of the file cursor.
        */
        seek(whence?: string, offset?: number): number

        /**
            🛈 DeprecatedThis has no effect in CC.
            
            
            Sets the buffering mode for an output file.
            
            This has no effect under ComputerCraft, and exists with compatility
            with base Lua.
            
            @param mode The buffering mode.
            @param size? The size of the buffer.
        */
        setvbuf(mode: string, size?: number): void

        /**
            Write one or more values to the file
            
            @param ... The values to write.
            
            @returns The current file, allowing chained calls.
        */
        write(..._: (string | number)[]): Handle

    }

}
/**
    Constants for all keyboard "key codes", as queued by the key event.
    
    [Documentation](https://tweaked.cc/module/keys.html)
*/
declare namespace keys {
    /**
        Translates a numerical key code to a human-readable name. The human-readable
        name is one of the constants in the keys API.
        
        @param code The key code to look up.
        
        @returns The name of the key, or nil if not a valid key code.
    */
    export function getName(code: number): string | null

}
/**
    Multishell allows multiple programs to be run at the same time.
    
    [Documentation](https://tweaked.cc/module/multishell.html)
*/
declare namespace multishell {
    /**
        Get the currently visible process. This will be the one selected on
        the tab bar.
        
        Note, this is different to getCurrent, which returns the process which is
        currently executing.
        
        
        @returns The currently visible process's index.
    */
    export function getFocus(): number

    /**
        Change the currently visible process.
        
        @param n The process index to switch to.
        
        @returns If the process was changed successfully. This will
        return false if there is no process with this id.
    */
    export function setFocus(n: number): boolean

    /**
        Get the title of the given tab.
        
        This starts as the name of the program, but may be changed using
        multishell.setTitle.
        
        @param n The process index.
        
        @returns The current process title, or nil if the
        process doesn't exist.
    */
    export function getTitle(n: number): string | null

    /**
        Set the title of the given process.
        
        @param n The process index.
        @param title The new process title.
    */
    export function setTitle(n: number, title: string): void

    /**
        Get the index of the currently running process.
        
        
        @returns The currently running process.
    */
    export function getCurrent(): number

    /**
        Start a new process, with the given environment, program and arguments.
        
        The returned process index is not constant over the program's run. It can be
        safely used immediately after launching (for instance, to update the title or
        switch to that tab). However, after your program has yielded, it may no
        longer be correct.
        
        @param tProgramEnv The environment to load the path under.
        @param sProgramPath The path to the program to run.
        @param ... Additional arguments to pass to the program.
        
        @returns The index of the created process.
    */
    export function launch(tProgramEnv: object, sProgramPath: string, ..._: /*not provided*/ any[]): number

    /**
        Get the number of processes within this multishell.
        
        
        @returns The number of processes.
    */
    export function getCount(): number

}
/**
    The os API allows interacting with the current computer.
    
    [Documentation](https://tweaked.cc/module/os.html)
*/
declare namespace os {
    /**
        🛈 DeprecatedWhen possible it's best to avoid using this function. It pollutes
        the global table and can mask errors.
        require should be used to load libraries instead.
        
        
        Loads the given API into the global environment.
        
        This function loads and executes the file at the given path, and all global
        variables and functions exported by it will by available through the use of
        myAPI.<function name>, where myAPI is the base name of the API file.
        
        @param path The path of the API to load.
        
        @returns Whether or not the API was successfully loaded.
    */
    export function loadAPI(path: string): boolean

    /**
        🛈 DeprecatedSee os.loadAPI for why.
        
        
        Unloads an API which was loaded by os.loadAPI.
        
        This effectively removes the specified table from _G.
        
        @param name The name of the API to unload.
    */
    export function unloadAPI(name: string): void

    /**
        Pause execution of the current thread and waits for any events matching
        filter.
        
        This function yields the current process and waits for it
        to be resumed with a vararg list where the first element matches filter.
        If no filter is supplied, this will match all events.
        
        Unlike os.pullEventRaw, it will stop the application upon a "terminate"
        event, printing the error "Terminated".
        
        @param filter? Event to filter for.
        
        @returns event The name of the event that fired.
        @returns param... Optional additional parameters of the event.
    */
    export function pullEvent(filter?: string): LuaMultiReturn<[string, ...any]>

    /**
        Pause execution of the current thread and waits for events, including the
        terminate event.
        
        This behaves almost the same as os.pullEvent, except it allows you to handle
        the terminate event yourself - the program will not stop execution when
        Ctrl+T is pressed.
        
        @param filter? Event to filter for.
        
        @returns event The name of the event that fired.
        @returns param... Optional additional parameters of the event.
    */
    export function pullEventRaw(filter?: string): LuaMultiReturn<[string, ...any]>

    /**
        Pauses execution for the specified number of seconds, alias of _G.sleep.
        
        @param time The number of seconds to sleep for, rounded up to the
        nearest multiple of 0.05.
    */
    export function sleep(time: number): void

    /**
        Get the current CraftOS version (for example, CraftOS 1.8).
        
        This is defined by bios.lua. For the current version of CC:Tweaked, this
        should return CraftOS 1.8.
        
        
        @returns The current CraftOS version.
    */
    export function version(): string

    /**
        Run the program at the given path with the specified environment and
        arguments.
        
        This function does not resolve program names like the shell does. This means
        that, for example, os.run("edit") will not work. As well as this, it does not
        provide access to the shell API in the environment. For this behaviour, use
        shell.run instead.
        
        If the program cannot be found, or failed to run, it will print the error and
        return false. If you want to handle this more gracefully, use an alternative
        such as loadfile.
        
        @param env The environment to run the program with.
        @param path The exact path of the program to run.
        @param ... The arguments to pass to the program.
        
        @returns Whether or not the program ran successfully.
    */
    export function run(env: object, path: string, ..._: /*not provided*/ any[]): boolean

    /**
        Adds an event to the event queue. This event can later be pulled with
        os.pullEvent.
        
        @param name The name of the event to queue.
        @param ... The parameters of the event. These can be any primitive type (boolean, number, string) as well as
        tables. Other types (like functions), as well as metatables, will not be preserved.
    */
    export function queueEvent(name: string, ..._: /*not provided*/ any[]): void

    /**
        Starts a timer that will run for the specified number of seconds. Once
        the timer fires, a timer event will be added to the queue with
        the ID returned from this function as the first parameter.
        
        As with sleep, timer will automatically be rounded up
        to the nearest multiple of 0.05 seconds, as it waits for a fixed amount
        of world ticks.
        
        @param timer The number of seconds until the timer fires.
        
        @returns The ID of the new timer. This can be used to filter the
        timer event, or cancel the timer.
        
        @throws If the time is below zero.
    */
    export function startTimer(timer: number): number

    /**
        Cancels a timer previously started with startTimer. This will stop the
        timer from firing.
        
        @param token The ID of the timer to cancel.
    */
    export function cancelTimer(token: number): void

    /**
        Sets an alarm that will fire at the specified in-game time. When it
        fires, * an alarm event will be added to the event queue with the
        ID * returned from this function as the first parameter.
        
        @param time The time at which to fire the alarm, in the range [0.0, 24.0).
        
        @returns The ID of the new alarm. This can be used to filter the
        alarm event, or cancel the alarm.
        
        @throws If the time is out of range.
    */
    export function setAlarm(time: number): number

    /**
        Cancels an alarm previously started with setAlarm. This will stop the
        alarm from firing.
        
        @param token The ID of the alarm to cancel.
    */
    export function cancelAlarm(token: number): void

    /**
        Shuts down the computer immediately.
        
    */
    export function shutdown(): void

    /**
        Reboots the computer immediately.
        
    */
    export function reboot(): void

    /**
        Returns the ID of the computer.
        
        
        @returns The ID of the computer.
    */
    export function getComputerID(): number

    /**
        Returns the ID of the computer.
        
        
        @returns The ID of the computer.
    */
    export function computerID(): number

    /**
        Returns the label of the computer, or nil if none is set.
        
        
        @returns The label of the computer.
    */
    export function getComputerLabel(): string | null

    /**
        Returns the label of the computer, or nil if none is set.
        
        
        @returns The label of the computer.
    */
    export function computerLabel(): string | null

    /**
        Set the label of this computer.
        
        @param label? The new label. May be nil in order to clear it.
    */
    export function setComputerLabel(label?: string): void

    /**
        Returns the number of seconds that the computer has been running.
        
        
        @returns The computer's uptime.
    */
    export function clock(): number

    /**
        Returns the current time depending on the string passed in. This will
        always be in the range [0.0, 24.0).
        
        
        If called with ingame, the current world time will be returned.
        This is the default if nothing is passed.
        If called with utc, returns the hour of the day in UTC time.
        If called with local, returns the hour of the day in the
        timezone the server is located in.
        
        
        This function can also be called with a table returned from date,
        which will convert the date fields into a UNIX timestamp (number of
        seconds since 1 January 1970).
        
        @param locale? The locale of the time, or a table filled by os.date("*t") to decode. Defaults to ingame locale if not specified.
        
        @returns The hour of the selected locale, or a UNIX timestamp from the table, depending on the argument passed in.
        
        @throws If an invalid locale is passed.
    */
    export function time(locale?: string | object): any

    /**
        Returns the day depending on the locale specified.
        
        
        If called with ingame, returns the number of days since the
        world was created. This is the default.
        If called with utc, returns the number of days since 1 January
        1970 in the UTC timezone.
        If called with local, returns the number of days since 1
        January 1970 in the server's local timezone.
        
        
        @param args? The locale to get the day for. Defaults to ingame if not set.
        
        @returns The day depending on the selected locale.
        
        @throws If an invalid locale is passed.
    */
    export function day(args?: string): number

    /**
        Returns the number of milliseconds since an epoch depending on the locale.
        
        
        If called with ingame, returns the number of in-game milliseconds since the
        world was created. This is the default.
        If called with utc, returns the number of milliseconds since 1
        January 1970 in the UTC timezone.
        If called with local, returns the number of milliseconds since 1
        January 1970 in the server's local timezone.
        
        
        🛈 infoThe ingame time zone assumes that one Minecraft day consists of 86,400,000
        milliseconds. Since one in-game day is much faster than a real day (20 minutes), this
        will change quicker than real time - one real second is equal to 72000 in-game
        milliseconds. If you wish to convert this value to real time, divide by 72000; to
        convert to ticks (where a day is 24000 ticks), divide by 3600.
        
        
        @param args? The locale to get the milliseconds for. Defaults to ingame if not set.
        
        @returns The milliseconds since the epoch depending on the selected locale.
        
        @throws If an invalid locale is passed.
    */
    export function epoch(args?: string): number

    /**
        Returns a date string (or table) using a specified format string and
        optional time to format.
        
        The format string takes the same formats as C's strftime function
        (http://www.cplusplus.com/reference/ctime/strftime/). In extension, it
        can be prefixed with an exclamation mark (!) to use UTC time
        instead of the server's local timezone.
        
        If the format is exactly *t (optionally prefixed with !), a
        table will be returned instead. This table has fields for the year, month,
        day, hour, minute, second, day of the week, day of the year, and whether
        Daylight Savings Time is in effect. This table can be converted to a UNIX
        timestamp (days since 1 January 1970) with date.
        
        @param format? The format of the string to return. This defaults to %c, which expands to a string similar to "Sat Dec 24 16:58:00 2011".
        @param time? The time to convert to a string. This defaults to the current time.
        
        @returns The resulting format string.
        
        @throws If an invalid format is passed.
    */
    export function date(format?: string, time?: number): any

}
/**
    Utilities for drawing more complex graphics, such as pixels, lines and
    images.
    
    [Documentation](https://tweaked.cc/module/paintutils.html)
*/
declare namespace paintutils {
    /**
        Parses an image from a multi-line string
        
        @param image The string containing the raw-image data.
        
        @returns The parsed image data, suitable for use with
        paintutils.drawImage.
    */
    export function parseImage(image: string): object

    /**
        Loads an image from a file.
        
        You can create a file suitable for being loaded using the paint program.
        
        @param path The file to load.
        
        @returns The parsed image data, suitable for use with
        paintutils.drawImage, or nil if the file does not exist.
    */
    export function loadImage(path: string): object | null

    /**
        Draws a single pixel to the current term at the specified position.
        
        Be warned, this may change the position of the cursor and the current
        background colour. You should not expect either to be preserved.
        
        @param xPos The x position to draw at, where 1 is the far left.
        @param yPos The y position to draw at, where 1 is the very top.
        @param colour? The color of this pixel. This will be
        the current background colour if not specified.
    */
    export function drawPixel(xPos: number, yPos: number, colour?: number): void

    /**
        Draws a straight line from the start to end position.
        
        Be warned, this may change the position of the cursor and the current
        background colour. You should not expect either to be preserved.
        
        @param startX The starting x position of the line.
        @param startY The starting y position of the line.
        @param endX The end x position of the line.
        @param endY The end y position of the line.
        @param colour? The color of this pixel. This will be
        the current background colour if not specified.
    */
    export function drawLine(startX: number, startY: number, endX: number, endY: number, colour?: number): void

    /**
        Draws the outline of a box on the current term from the specified start
        position to the specified end position.
        
        Be warned, this may change the position of the cursor and the current
        background colour. You should not expect either to be preserved.
        
        @param startX The starting x position of the line.
        @param startY The starting y position of the line.
        @param endX The end x position of the line.
        @param endY The end y position of the line.
        @param colour? The color of this pixel. This will be
        the current background colour if not specified.
    */
    export function drawBox(startX: number, startY: number, endX: number, endY: number, colour?: number): void

    /**
        Draws a filled box on the current term from the specified start position to
        the specified end position.
        
        Be warned, this may change the position of the cursor and the current
        background colour. You should not expect either to be preserved.
        
        @param startX The starting x position of the line.
        @param startY The starting y position of the line.
        @param endX The end x position of the line.
        @param endY The end y position of the line.
        @param colour? The color of this pixel. This will be
        the current background colour if not specified.
    */
    export function drawFilledBox(startX: number, startY: number, endX: number, endY: number, colour?: number): void

    /**
        Draw an image loaded by paintutils.parseImage or paintutils.loadImage.
        
        @param image The parsed image data.
        @param xPos The x position to start drawing at.
        @param yPos The y position to start drawing at.
    */
    export function drawImage(image: object, xPos: number, yPos: number): void

}
/**
    A simple way to run several functions at once.
    
    [Documentation](https://tweaked.cc/module/parallel.html)
*/
declare namespace parallel {
    /**
        Switches between execution of the functions, until any of them
        finishes. If any of the functions errors, the message is propagated upwards
        from the parallel.waitForAny call.
        
        @param ... The functions this task will run
    */
    export function waitForAny(..._: Function[]): void

    /**
        Switches between execution of the functions, until all of them are
        finished. If any of the functions errors, the message is propagated upwards
        from the parallel.waitForAll call.
        
        @param ... The functions this task will run
    */
    export function waitForAll(..._: Function[]): void

}
/**
    Find and control peripherals attached to this computer.
    
    [Documentation](https://tweaked.cc/module/peripheral.html)
*/
declare namespace peripheral {
    /**
        Provides a list of all peripherals available.
        
        If a device is located directly next to the system, then its name will be
        listed as the side it is attached to. If a device is attached via a Wired
        Modem, then it'll be reported according to its name on the wired network.
        
        
        @returns A list of the names of all attached peripherals.
    */
    export function getNames(): string[]

    /**
        Determines if a peripheral is present with the given name.
        
        @param name The side or network name that you want to check.
        
        @returns If a peripheral is present with the given name.
    */
    export function isPresent(name: string): boolean

    /**
        Get the types of a named or wrapped peripheral.
        
        @param peripheral The name of the peripheral to find, or a
        wrapped peripheral instance.
        
        @returns The peripheral's types, or nil if it is not present.
    */
    export function getType(peripheral: string | object): LuaMultiReturn<(string)[]>

    /**
        Check if a peripheral is of a particular type.
        
        @param peripheral The name of the peripheral or a wrapped peripheral instance.
        @param peripheral_type The type to check.
        
        @returns If a peripheral has a particular type, or nil if it is not present.
    */
    export function hasType(peripheral: string | object, peripheral_type: string): boolean | null

    /**
        Get all available methods for the peripheral with the given name.
        
        @param name The name of the peripheral to find.
        
        @returns A list of methods provided by this peripheral, or nil if
        it is not present.
    */
    export function getMethods(name: string): string[] | null

    /**
        Get the name of a peripheral wrapped with peripheral.wrap.
        
        @param peripheral The peripheral to get the name of.
        
        @returns The name of the given peripheral.
    */
    export function getName(peripheral: object): string

    /**
        Call a method on the peripheral with the given name.
        
        @param name The name of the peripheral to invoke the method on.
        @param method The name of the method
        @param ... Additional arguments to pass to the method
        
        @returns The return values of the peripheral method.
    */
    export function call(name: string, method: string, ..._: /*not provided*/ any[]): /*not provided*/ any

    /**
        Get a table containing all functions available on a peripheral. These can
        then be called instead of using peripheral.call every time.
        
        @param name The name of the peripheral to wrap.
        
        @returns The table containing the peripheral's methods, or nil if
        there is no peripheral present with the given name.
    */
    export function wrap(name: string): object | null

    /**
        Find all peripherals of a specific type, and return the
        wrapped peripherals.
        
        @param ty The type of peripheral to look for.
        @param filter? A
        filter function, which takes the peripheral's name and wrapped table
        and returns if it should be included in the result.
        
        @returns 0 or more wrapped peripherals matching the given filters.
    */
    export function find(ty: string, filter?: (name: string, wrapped: object) => boolean): LuaMultiReturn<(object)[]>

}
/**
    Control the current pocket computer, adding or removing upgrades.
    
    [Documentation](https://tweaked.cc/module/pocket.html)
*/
declare namespace pocket {
    /**
        Search the player's inventory for another upgrade, replacing the existing one with that item if found.
        
        This inventory search starts from the player's currently selected slot, allowing you to prioritise upgrades.
        
        
        @returns If an item was equipped.
        @returns The reason an item was not equipped.
    */
    export function equipBack(): LuaMultiReturn<[boolean, string | null]>

    /**
        Remove the pocket computer's current upgrade.
        
        
        @returns If the upgrade was unequipped.
        @returns The reason an upgrade was not unequipped.
    */
    export function unequipBack(): LuaMultiReturn<[boolean, string | null]>

}
/**
    Communicate with other computers by using modems. rednet
    provides a layer of abstraction on top of the main modem peripheral, making
    it slightly easier to use.
    
    [Documentation](https://tweaked.cc/module/rednet.html)
*/
declare namespace rednet {
    /**
        The channel used by the Rednet API to broadcast messages.
    */
    export const CHANNEL_BROADCAST = 65535

    /**
        The channel used by the Rednet API to repeat messages.
    */
    export const CHANNEL_REPEAT = 65533

    /**
        The number of channels rednet reserves for computer IDs. Computers with IDs
        greater or equal to this limit wrap around to 0.
    */
    export const MAX_ID_CHANNELS = 65500

    /**
        Opens a modem with the given peripheral name, allowing it to send and
        receive messages over rednet.
        
        This will open the modem on two channels: one which has the same
        ID as the computer, and another on
        the broadcast channel.
        
        @param modem The name of the modem to open.
        
        @throws If there is no such modem with the given name
    */
    export function open(modem: string): void

    /**
        Close a modem with the given peripheral name, meaning it can no longer
        send and receive rednet messages.
        
        @param modem? The side the modem exists on. If not given, all
        open modems will be closed.
        
        @throws If there is no such modem with the given name
    */
    export function close(modem?: string): void

    /**
        Determine if rednet is currently open.
        
        @param modem? Which modem to check. If not given, all connected
        modems will be checked.
        
        @returns If the given modem is open.
    */
    export function isOpen(modem?: string): boolean

    /**
        Allows a computer or turtle with an attached modem to send a message
        intended for a sycomputer with a specific ID. At least one such modem must first
        be opened before sending is possible.
        
        Assuming the target was in range and also had a correctly opened modem, the
        target computer may then use rednet.receive to collect the message.
        
        @param recipient The ID of the receiving computer.
        @param message The message to send. Like with modem.transmit, this can
        contain any primitive type (numbers, booleans and strings) as well as
        tables. Other types (like functions), as well as metatables, will not be
        transmitted.
        @param protocol? The "protocol" to send this message under. When
        using rednet.receive one can filter to only receive messages sent under a
        particular protocol.
        
        @returns If this message was successfully sent (i.e. if rednet is
        currently open). Note, this does not guarantee the message was
        actually received.
    */
    export function send(recipient: number, message: /*not provided*/ any, protocol?: string): boolean

    /**
        Broadcasts a string message over the predefined CHANNEL_BROADCAST
        channel. The message will be received by every device listening to rednet.
        
        @param message The message to send. This should not contain coroutines or
        functions, as they will be converted to nil.
        @param protocol? The "protocol" to send this message under. When
        using rednet.receive one can filter to only receive messages sent under a
        particular protocol.
    */
    export function broadcast(message: /*not provided*/ any, protocol?: string): void

    /**
        Wait for a rednet message to be received, or until nTimeout seconds have
        elapsed.
        
        @param protocol_filter? The protocol the received message must be
        sent with. If specified, any messages not sent under this protocol will be
        discarded.
        @param timeout? The number of seconds to wait if no message is
        received.
        
        @returns The computer which sent this message
        @returns The received message
        @returns The protocol this message was sent under.
    */
    export function receive(protocol_filter?: string, timeout?: number): LuaMultiReturn<[number, /*not provided*/ any, string | null]>

    /**
        Register the system as "hosting" the desired protocol under the specified
        name. If a rednet lookup is performed for that protocol (and
        maybe name) on the same network, the registered system will automatically
        respond via a background process, hence providing the system performing the
        lookup with its ID number.
        
        Multiple computers may not register themselves on the same network as having the
        same names against the same protocols, and the title localhost is specifically
        reserved. They may, however, share names as long as their hosted protocols are
        different, or if they only join a given network after "registering" themselves
        before doing so (eg while offline or part of a different network).
        
        @param protocol The protocol this computer provides.
        @param hostname The name this computer exposes for the given protocol.
        
        @throws If trying to register a hostname which is reserved, or currently in use.
    */
    export function host(protocol: string, hostname: string): void

    /**
        Stop hosting a specific protocol, meaning it will no longer
        respond to rednet.lookup requests.
        
        @param protocol The protocol to unregister your self from.
    */
    export function unhost(protocol: string): void

    /**
        Search the local rednet network for systems hosting the
        desired protocol and returns any computer IDs that respond as "registered"
        against it.
        
        If a hostname is specified, only one ID will be returned (assuming an exact
        match is found).
        
        @param protocol The protocol to search for.
        @param hostname? The hostname to search for.
        
        @returns A list of computer IDs hosting the given protocol.
    */
    export function lookup(protocol: string, hostname?: string): LuaMultiReturn<(number)[]>

    /**
        Listen for modem messages and converts them into rednet messages, which may
        then be received.
        
        This is automatically started in the background on computer startup, and
        should not be called manually.
        
    */
    export function run(): void

}
/**
    Get and set redstone signals adjacent to this computer.
    
    [Documentation](https://tweaked.cc/module/redstone.html)
*/
declare namespace redstone {
    /**
        Returns a table containing the six sides of the computer. Namely, "top", "bottom", "left", "right", "front" and
        "back".
        
        
        @returns A table of valid sides.
    */
    export function getSides(): string[]

    /**
        Turn the redstone signal of a specific side on or off.
        
        @param side The side to set.
        @param on Whether the redstone signal should be on or off. When on, a signal strength of 15 is emitted.
    */
    export function setOutput(side: string, on: boolean): void

    /**
        Get the current redstone output of a specific side.
        
        @param side The side to get.
        
        @returns Whether the redstone output is on or off.
    */
    export function getOutput(side: string): boolean

    /**
        Get the current redstone input of a specific side.
        
        @param side The side to get.
        
        @returns Whether the redstone input is on or off.
    */
    export function getInput(side: string): boolean

    /**
        Set the redstone signal strength for a specific side.
        
        @param side The side to set.
        @param value The signal strength between 0 and 15.
        
        @throws If value is not between 0 and 15.
    */
    export function setAnalogOutput(side: string, value: number): void

    /**
        Set the redstone signal strength for a specific side.
        
        @param side The side to set.
        @param value The signal strength between 0 and 15.
        
        @throws If value is not between 0 and 15.
    */
    export function setAnalogueOutput(side: string, value: number): void

    /**
        Get the redstone output signal strength for a specific side.
        
        @param side The side to get.
        
        @returns The output signal strength, between 0 and 15.
    */
    export function getAnalogOutput(side: string): number

    /**
        Get the redstone output signal strength for a specific side.
        
        @param side The side to get.
        
        @returns The output signal strength, between 0 and 15.
    */
    export function getAnalogueOutput(side: string): number

    /**
        Get the redstone input signal strength for a specific side.
        
        @param side The side to get.
        
        @returns The input signal strength, between 0 and 15.
    */
    export function getAnalogInput(side: string): number

    /**
        Get the redstone input signal strength for a specific side.
        
        @param side The side to get.
        
        @returns The input signal strength, between 0 and 15.
    */
    export function getAnalogueInput(side: string): number

    /**
        Set the bundled cable output for a specific side.
        
        @param side The side to set.
        @param output The colour bitmask to set.
    */
    export function setBundledOutput(side: string, output: number): void

    /**
        Get the bundled cable output for a specific side.
        
        @param side The side to get.
        
        @returns The bundle cable's output.
    */
    export function getBundledOutput(side: string): number

    /**
        Get the bundled cable input for a specific side.
        
        @param side The side to get.
        
        @returns The bundle cable's input.
    */
    export function getBundledInput(side: string): number

    /**
        Determine if a specific combination of colours are on for the given side.
        
        @param side The side to test.
        @param mask The mask to test.
        
        @returns If the colours are on.
    */
    export function testBundledInput(side: string, mask: number): boolean

}
/**
    Read and write configuration options for CraftOS and your programs.
    
    [Documentation](https://tweaked.cc/module/settings.html)
*/
declare namespace settings {
    /**
        Define a new setting, optional specifying various properties about it.
        
        While settings do not have to be added before being used, doing so allows
        you to provide defaults and additional metadata.
        
        @param name The name of this option
        @param options? Options for this setting. This table accepts the following fields:
        
        description: A description which may be printed when running the set program.
        default: A default value, which is returned by settings.get if the
        setting has not been changed.
        type: Require values to be of this type. Setting the value to another type
        will error.
    */
    export function define(name: string, options?: { description?: string, default?: any, type?: string }): void

    /**
        Remove a definition of a setting.
        
        If a setting has been changed, this does not remove its value. Use settings.unset
        for that.
        
        @param name The name of this option
    */
    export function undefine(name: string): void

    /**
        Set the value of a setting.
        
        ⚠ warningCalling settings.set does not update the settings file by default. You
        must call settings.save to persist values.
        
        
        @param name The name of the setting to set
        @param value The setting's value. This cannot be nil, and must be
        serialisable by textutils.serialize.
        
        @throws If this value cannot be serialised
    */
    export function set(name: string, value: /*not provided*/ any): void

    /**
        Get the value of a setting.
        
        @param name The name of the setting to get.
        @param __default? The value to use should there be pre-existing value for
        this setting. If not given, it will use the setting's default value if given,
        or nil otherwise.
        
        @returns The setting's, or the default if the setting has not been changed.
    */
    export function get(name: string, __default?: /*not provided*/ any): /*not provided*/ any

    /**
        Get details about a specific setting.
        
        @param name The name of the setting to get.
        
        @returns Information about this setting. This includes all information from settings.define,
        as well as this setting's value.
    */
    export function getDetails(name: string): { description?: string, default?: any, type?: string, value?: any }

    /**
        Remove the value of a setting, setting it to the default.
        
        settings.get will return the default value until the setting's value is
        set, or the computer is rebooted.
        
        @param name The name of the setting to unset.
    */
    export function unset(name: string): void

    /**
        Resets the value of all settings. Equivalent to calling settings.unset
        
        
        on every setting.
        
        
        @see settings.unset
        
    */
    export function clear(): void

    /**
        Get the names of all currently defined settings.
        
        
        @returns An alphabetically sorted list of all currently-defined
        settings.
    */
    export function getNames(): string[]

    /**
        Load settings from the given file.
        
        Existing settings will be merged with any pre-existing ones. Conflicting
        entries will be overwritten, but any others will be preserved.
        
        @param sPath? The file to load from, defaulting to .settings.
        
        @returns Whether settings were successfully read from this
        file. Reasons for failure may include the file not existing or being
        corrupted.
    */
    export function load(sPath?: string): boolean

    /**
        Save settings to the given file.
        
        This will entirely overwrite the pre-existing file. Settings defined in the
        file, but not currently loaded will be removed.
        
        @param sPath? The path to save settings to, defaulting to .settings.
        
        @returns If the settings were successfully saved.
    */
    export function save(sPath?: string): boolean

}
/**
    The shell API provides access to CraftOS's command line interface.
    
    [Documentation](https://tweaked.cc/module/shell.html)
*/
declare namespace shell {
    /**
        Run a program with the supplied arguments.
        
        Unlike shell.run, each argument is passed to the program verbatim. While
        shell.run("echo", "b c") runs echo with b and c,
        shell.execute("echo", "b c") runs echo with a single argument b c.
        
        @param command The program to execute.
        @param ... Arguments to this program.
        
        @returns Whether the program exited successfully.
    */
    export function execute(command: string, ..._: string[]): boolean

    /**
        Run a program with the supplied arguments.
        
        All arguments are concatenated together and then parsed as a command line. As
        a result, shell.run("program a b") is the same as shell.run("program", "a", "b").
        
        @param ... The program to run and its arguments.
        
        @returns Whether the program exited successfully.
    */
    export function run(..._: string[]): boolean

    /**
        Exit the current shell.
        
        This does not terminate your program, it simply makes the shell terminate
        after your program has finished. If this is the toplevel shell, then the
        computer will be shutdown.
        
    */
    export function exit(): void

    /**
        Return the current working directory. This is what is displayed before the
        >  of the shell prompt, and is used by shell.resolve to handle relative
        paths.
        
        
        @returns The current working directory.
    */
    export function dir(): string

    /**
        Set the current working directory.
        
        @param dir The new working directory.
        
        @throws If the path does not exist or is not a directory.
    */
    export function setDir(dir: string): void

    /**
        Set the path where programs are located.
        
        The path is composed of a list of directory names in a string, each separated
        by a colon (:). On normal turtles will look in the current directory (.),
        /rom/programs and /rom/programs/turtle folder, making the path
        .:/rom/programs:/rom/programs/turtle.
        
        
        @returns The current shell's path.
    */
    export function path(): string

    /**
        Set the current program path.
        
        Be careful to prefix directories with a /. Otherwise they will be searched
        for from the current directory, rather than the computer's root.
        
        @param path The new program path.
    */
    export function setPath(path: string): void

    /**
        Resolve a relative path to an absolute path.
        
        The fs and io APIs work using absolute paths, and so we must convert
        any paths relative to the current directory to absolute ones. This
        does nothing when the path starts with /.
        
        @param path The path to resolve.
    */
    export function resolve(path: string): void

    /**
        Resolve a program, using the program path and list of aliases.
        
        @param command The name of the program
        
        @returns The absolute path to the program, or nil if it could
        not be found.
    */
    export function resolveProgram(command: string): string | null

    /**
        Return a list of all programs on the path.
        
        @param include_hidden? Include hidden files. Namely, any which
        start with ..
        
        @returns A list of available programs.
    */
    export function programs(include_hidden?: boolean): string[]

    /**
        Complete a shell command line.
        
        This accepts an incomplete command, and completes the program name or
        arguments. For instance, l will be completed to ls, and ls ro will be
        completed to ls rom/.
        
        Completion handlers for your program may be registered with
        shell.setCompletionFunction.
        
        @param sLine The input to complete.
        
        @returns The list of possible completions.
    */
    export function complete(sLine: string): string[] | null

    /**
        Complete the name of a program.
        
        @param program The name of a program to complete.
        
        @returns A list of possible completions.
    */
    export function completeProgram(program: string): string[]

    /**
        Set the completion function for a program. When the program is entered on
        the command line, this program will be called to provide auto-complete
        information.
        
        The completion function accepts four arguments:
        
        
        The current shell. As completion functions are inherited, this is not
        guaranteed to be the shell you registered this function in.
        The index of the argument currently being completed.
        The current argument. This may be the empty string.
        A list of the previous arguments.
        
        
        For instance, when completing pastebin put rom/st our pastebin completion
        function will receive the shell API, an index of 2, rom/st as the current
        argument, and a "previous" table of { "put" }. This function may then wish
        to return a table containing artup.lua, indicating the entire command
        should be completed to pastebin put rom/startup.lua.
        
        You completion entries may also be followed by a space, if you wish to
        indicate another argument is expected.
        
        @param program The path to the program. This should be an absolute path
        without the leading /.
        @param complete The completion function.
    */
    export function setCompletionFunction(program: string, complete: (shell: object, index: number, argument: string, previous: string[]) => string[] | null): void

    /**
        Get a table containing all completion functions.
        
        This should only be needed when building custom shells. Use
        setCompletionFunction to add a completion function.
        
        
        @returns A table mapping the
        absolute path of programs, to their completion functions.
    */
    export function getCompletionInfo(): { [index: string]: { fnComplete: Function } }

    /**
        Returns the path to the currently running program.
        
        
        @returns The absolute path to the running program.
    */
    export function getRunningProgram(): string

    /**
        Add an alias for a program.
        
        @param command The name of the alias to add.
        @param program The name or path to the program.
    */
    export function setAlias(command: string, program: string): void

    /**
        Remove an alias.
        
        @param command The alias name to remove.
    */
    export function clearAlias(command: string): void

    /**
        Get the current aliases for this shell.
        
        Aliases are used to allow multiple commands to refer to a single program. For
        instance, the list program is aliased to dir or ls. Running ls, dir
        or list in the shell will all run the list program.
        
        
        @returns A table, where the keys are the names of
        aliases, and the values are the path to the program.
    */
    export function aliases(): { [index: string]: string }

    /**
        Open a new multishell tab running a command.
        
        This behaves similarly to shell.run, but instead returns the process
        index.
        
        This function is only available if the multishell API is.
        
        @param ... The command line to run.
    */
    export function openTab(..._: string[]): void

    /**
        Switch to the multishell tab with the given index.
        
        @param id The tab to switch to.
    */
    export function switchTab(id: number): void

}
/**
    Interact with a computer's terminal or monitors, writing text and drawing
    ASCII graphics.
    
    [Documentation](https://tweaked.cc/module/term.html)
*/
declare namespace term {
    /**
        Get the default palette value for a colour.
        
        @param colour The colour whose palette should be fetched.
        
        @returns The red channel, will be between 0 and 1.
        @returns The green channel, will be between 0 and 1.
        @returns The blue channel, will be between 0 and 1.
        
        @throws When given an invalid colour.
    */
    export function nativePaletteColour(colour: number): LuaMultiReturn<[number, number, number]>

    /**
        Get the default palette value for a colour.
        
        @param colour The colour whose palette should be fetched.
        
        @returns The red channel, will be between 0 and 1.
        @returns The green channel, will be between 0 and 1.
        @returns The blue channel, will be between 0 and 1.
        
        @throws When given an invalid colour.
    */
    export function nativePaletteColor(colour: number): LuaMultiReturn<[number, number, number]>

    /**
        Write text at the current cursor position, moving the cursor to the end of the text.
        
        Unlike functions like write and print, this does not wrap the text - it simply copies the
        text to the current terminal line.
        
        @param text The text to write.
    */
    export function write(text: string): void

    /**
        Move all positions up (or down) by y pixels.
        
        Every pixel in the terminal will be replaced by the line y pixels below it. If y is negative, it
        will copy pixels from above instead.
        
        @param y The number of lines to move up by. This may be a negative number.
    */
    export function scroll(y: number): void

    /**
        Get the position of the cursor.
        
        
        @returns The x position of the cursor.
        @returns The y position of the cursor.
    */
    export function getCursorPos(): LuaMultiReturn<[number, number]>

    /**
        Set the position of the cursor. terminal writes will begin from this position.
        
        @param x The new x position of the cursor.
        @param y The new y position of the cursor.
    */
    export function setCursorPos(x: number, y: number): void

    /**
        Checks if the cursor is currently blinking.
        
        
        @returns If the cursor is blinking.
    */
    export function getCursorBlink(): boolean

    /**
        Sets whether the cursor should be visible (and blinking) at the current cursor position.
        
        @param blink Whether the cursor should blink.
    */
    export function setCursorBlink(blink: boolean): void

    /**
        Get the size of the terminal.
        
        
        @returns The terminal's width.
        @returns The terminal's height.
    */
    export function getSize(): LuaMultiReturn<[number, number]>

    /**
        Clears the terminal, filling it with the current background colour.
        
    */
    export function clear(): void

    /**
        Clears the line the cursor is currently on, filling it with the current background
        colour.
        
    */
    export function clearLine(): void

    /**
        Return the colour that new text will be written as.
        
        
        @returns The current text colour.
    */
    export function getTextColour(): number

    /**
        Return the colour that new text will be written as.
        
        
        @returns The current text colour.
    */
    export function getTextColor(): number

    /**
        Set the colour that new text will be written as.
        
        @param colour The new text colour.
    */
    export function setTextColour(colour: number): void

    /**
        Set the colour that new text will be written as.
        
        @param colour The new text colour.
    */
    export function setTextColor(colour: number): void

    /**
        Return the current background colour. This is used when writing text and clearing
        the terminal.
        
        
        @returns The current background colour.
    */
    export function getBackgroundColour(): number

    /**
        Return the current background colour. This is used when writing text and clearing
        the terminal.
        
        
        @returns The current background colour.
    */
    export function getBackgroundColor(): number

    /**
        Set the current background colour. This is used when writing text and clearing the
        terminal.
        
        @param colour The new background colour.
    */
    export function setBackgroundColour(colour: number): void

    /**
        Set the current background colour. This is used when writing text and clearing the
        terminal.
        
        @param colour The new background colour.
    */
    export function setBackgroundColor(colour: number): void

    /**
        Determine if this terminal supports colour.
        
        Terminals which do not support colour will still allow writing coloured text/backgrounds, but it will be
        displayed in greyscale.
        
        
        @returns Whether this terminal supports colour.
    */
    export function isColour(): boolean

    /**
        Determine if this terminal supports colour.
        
        Terminals which do not support colour will still allow writing coloured text/backgrounds, but it will be
        displayed in greyscale.
        
        
        @returns Whether this terminal supports colour.
    */
    export function isColor(): boolean

    /**
        Writes text to the terminal with the specific foreground and background colours.
        
        As with write, the text will be written at the current cursor location, with the cursor
        moving to the end of the text.
        
        textColour and backgroundColour must both be strings the same length as text. All
        characters represent a single hexadecimal digit, which is converted to one of CC's colours. For instance,
        "a" corresponds to purple.
        
        @param text The text to write.
        @param textColour The corresponding text colours.
        @param backgroundColour The corresponding background colours.
        
        @throws If the three inputs are not the same length.
    */
    export function blit(text: string, textColour: string, backgroundColour: string): void

    /**
        Set the palette for a specific colour.
        
        ComputerCraft's palette system allows you to change how a specific colour should be displayed. For instance, you
        can make colors.red more red by setting its palette to #FF0000. This does now allow you to draw more
        colours - you are still limited to 16 on the screen at one time - but you can change which colours are
        used.
        
        @param index The colour whose palette should be changed.
        @param colour A 24-bit integer representing the RGB value of the colour. For instance the integer
        0xFF0000 corresponds to the colour #FF0000.
    */
    export function setPaletteColour(index: number, colour: number): void

    /**
        Set the palette for a specific colour.
        
        ComputerCraft's palette system allows you to change how a specific colour should be displayed. For instance, you
        can make colors.red more red by setting its palette to #FF0000. This does now allow you to draw more
        colours - you are still limited to 16 on the screen at one time - but you can change which colours are
        used.
        
        @param index The colour whose palette should be changed.
        @param colour A 24-bit integer representing the RGB value of the colour. For instance the integer
        0xFF0000 corresponds to the colour #FF0000.
    */
    export function setPaletteColor(index: number, colour: number): void

    /**
        Get the current palette for a specific colour.
        
        @param colour The colour whose palette should be fetched.
        
        @returns The red channel, will be between 0 and 1.
        @returns The green channel, will be between 0 and 1.
        @returns The blue channel, will be between 0 and 1.
    */
    export function getPaletteColour(colour: number): LuaMultiReturn<[number, number, number]>

    /**
        Get the current palette for a specific colour.
        
        @param colour The colour whose palette should be fetched.
        
        @returns The red channel, will be between 0 and 1.
        @returns The green channel, will be between 0 and 1.
        @returns The blue channel, will be between 0 and 1.
    */
    export function getPaletteColor(colour: number): LuaMultiReturn<[number, number, number]>

    /**
        Redirects terminal output to a monitor, a window, or any other custom
        terminal object. Once the redirect is performed, any calls to a "term"
        function - or to a function that makes use of a term function, as print -
        will instead operate with the new terminal object.
        
        A "terminal object" is simply a table that contains functions with the same
        names - and general features - as those found in the term table. For example,
        a wrapped monitor is suitable.
        
        The redirect can be undone by pointing back to the previous terminal object
        (which this function returns whenever you switch).
        
        @param target The terminal redirect the term API will draw to.
        
        @returns The previous redirect object, as returned by
        term.current.
    */
    export function redirect(target: Redirect): Redirect

    /**
        Returns the current terminal object of the computer.
        
        
        @returns The current terminal redirect
    */
    export function current(): Redirect

    /**
        Get the native terminal object of the current computer.
        
        It is recommended you do not use this function unless you absolutely have
        to. In a multitasked environment, term.native will not be the current
        terminal object, and so drawing may interfere with other programs.
        
        
        @returns The native terminal redirect.
    */
    export function native(): Redirect

    /**
        A base class for all objects which interact with a terminal. Namely the term and monitors.
    */
    export interface Redirect {
        /**
            Write text at the current cursor position, moving the cursor to the end of the text.
            
            Unlike functions like write and print, this does not wrap the text - it simply copies the
            text to the current terminal line.
            
            @param text The text to write.
        @noSelf 
        */
        write(text: string): void

        /**
            Move all positions up (or down) by y pixels.
            
            Every pixel in the terminal will be replaced by the line y pixels below it. If y is negative, it
            will copy pixels from above instead.
            
            @param y The number of lines to move up by. This may be a negative number.
        @noSelf 
        */
        scroll(y: number): void

        /**
            Get the position of the cursor.
            
            
            @returns The x position of the cursor.
            @returns The y position of the cursor.
        @noSelf 
        */
        getCursorPos(): LuaMultiReturn<[number, number]>

        /**
            Set the position of the cursor. terminal writes will begin from this position.
            
            @param x The new x position of the cursor.
            @param y The new y position of the cursor.
        @noSelf 
        */
        setCursorPos(x: number, y: number): void

        /**
            Checks if the cursor is currently blinking.
            
            
            @returns If the cursor is blinking.
        @noSelf 
        */
        getCursorBlink(): boolean

        /**
            Sets whether the cursor should be visible (and blinking) at the current cursor position.
            
            @param blink Whether the cursor should blink.
        @noSelf 
        */
        setCursorBlink(blink: boolean): void

        /**
            Get the size of the terminal.
            
            
            @returns The terminal's width.
            @returns The terminal's height.
        @noSelf 
        */
        getSize(): LuaMultiReturn<[number, number]>

        /**
            Clears the terminal, filling it with the current background colour.
            
        @noSelf 
        */
        clear(): void

        /**
            Clears the line the cursor is currently on, filling it with the current background
            colour.
            
        @noSelf 
        */
        clearLine(): void

        /**
            Return the colour that new text will be written as.
            
            
            @returns The current text colour.
        @noSelf 
        */
        getTextColour(): number

        /**
            Return the colour that new text will be written as.
            
            
            @returns The current text colour.
        @noSelf 
        */
        getTextColor(): number

        /**
            Set the colour that new text will be written as.
            
            @param colour The new text colour.
        @noSelf 
        */
        setTextColour(colour: number): void

        /**
            Set the colour that new text will be written as.
            
            @param colour The new text colour.
        @noSelf 
        */
        setTextColor(colour: number): void

        /**
            Return the current background colour. This is used when writing text and clearing
            the terminal.
            
            
            @returns The current background colour.
        @noSelf 
        */
        getBackgroundColour(): number

        /**
            Return the current background colour. This is used when writing text and clearing
            the terminal.
            
            
            @returns The current background colour.
        @noSelf 
        */
        getBackgroundColor(): number

        /**
            Set the current background colour. This is used when writing text and clearing the
            terminal.
            
            @param colour The new background colour.
        @noSelf 
        */
        setBackgroundColour(colour: number): void

        /**
            Set the current background colour. This is used when writing text and clearing the
            terminal.
            
            @param colour The new background colour.
        @noSelf 
        */
        setBackgroundColor(colour: number): void

        /**
            Determine if this terminal supports colour.
            
            Terminals which do not support colour will still allow writing coloured text/backgrounds, but it will be
            displayed in greyscale.
            
            
            @returns Whether this terminal supports colour.
        @noSelf 
        */
        isColour(): boolean

        /**
            Determine if this terminal supports colour.
            
            Terminals which do not support colour will still allow writing coloured text/backgrounds, but it will be
            displayed in greyscale.
            
            
            @returns Whether this terminal supports colour.
        @noSelf 
        */
        isColor(): boolean

        /**
            Writes text to the terminal with the specific foreground and background colours.
            
            As with write, the text will be written at the current cursor location, with the cursor
            moving to the end of the text.
            
            textColour and backgroundColour must both be strings the same length as text. All
            characters represent a single hexadecimal digit, which is converted to one of CC's colours. For instance,
            "a" corresponds to purple.
            
            @param text The text to write.
            @param textColour The corresponding text colours.
            @param backgroundColour The corresponding background colours.
            
            @throws If the three inputs are not the same length.
        @noSelf 
        */
        blit(text: string, textColour: string, backgroundColour: string): void

        /**
            Set the palette for a specific colour.
            
            ComputerCraft's palette system allows you to change how a specific colour should be displayed. For instance, you
            can make colors.red more red by setting its palette to #FF0000. This does now allow you to draw more
            colours - you are still limited to 16 on the screen at one time - but you can change which colours are
            used.
            
            @param index The colour whose palette should be changed.
            @param colour A 24-bit integer representing the RGB value of the colour. For instance the integer
            0xFF0000 corresponds to the colour #FF0000.
        @noSelf 
        */
        setPaletteColour(index: number, colour: number): void

        /**
            Set the palette for a specific colour.
            
            ComputerCraft's palette system allows you to change how a specific colour should be displayed. For instance, you
            can make colors.red more red by setting its palette to #FF0000. This does now allow you to draw more
            colours - you are still limited to 16 on the screen at one time - but you can change which colours are
            used.
            
            @param index The colour whose palette should be changed.
            @param colour A 24-bit integer representing the RGB value of the colour. For instance the integer
            0xFF0000 corresponds to the colour #FF0000.
        @noSelf 
        */
        setPaletteColor(index: number, colour: number): void

        /**
            Get the current palette for a specific colour.
            
            @param colour The colour whose palette should be fetched.
            
            @returns The red channel, will be between 0 and 1.
            @returns The green channel, will be between 0 and 1.
            @returns The blue channel, will be between 0 and 1.
        @noSelf 
        */
        getPaletteColour(colour: number): LuaMultiReturn<[number, number, number]>

        /**
            Get the current palette for a specific colour.
            
            @param colour The colour whose palette should be fetched.
            
            @returns The red channel, will be between 0 and 1.
            @returns The green channel, will be between 0 and 1.
            @returns The blue channel, will be between 0 and 1.
        @noSelf 
        */
        getPaletteColor(colour: number): LuaMultiReturn<[number, number, number]>

    }

}
/**
    Helpful utilities for formatting and manipulating strings.
    
    [Documentation](https://tweaked.cc/module/textutils.html)
*/
declare namespace textutils {
    /**
        Slowly writes string text at current cursor position,
        character-by-character.
        
        Like _G.write, this does not insert a newline at the end.
        
        @param text The the text to write to the screen
        @param rate? The number of characters to write each second,
        Defaults to 20.
    */
    export function slowWrite(text: string, rate?: number): void

    /**
        Slowly prints string text at current cursor position,
        character-by-character.
        
        Like print, this inserts a newline after printing.
        
        @param sText The the text to write to the screen
        @param nRate? The number of characters to write each second,
        Defaults to 20.
    */
    export function slowPrint(sText: string, nRate?: number): void

    /**
        Takes input time and formats it in a more readable format such as 6:30 PM.
        
        @param nTime The time to format, as provided by os.time.
        @param bTwentyFourHour? Whether to format this as a 24-hour
        clock (18:30) rather than a 12-hour one (6:30 AM)
        
        @returns The formatted time
    */
    export function formatTime(nTime: number, bTwentyFourHour?: boolean): string

    /**
        Prints a given string to the display.
        
        If the action can be completed without scrolling, it acts much the same as
        print; otherwise, it will throw up a "Press any key to continue" prompt at
        the bottom of the display. Each press will cause it to scroll down and write a
        single line more before prompting again, if need be.
        
        @param text The text to print to the screen.
        @param free_lines? The number of lines which will be
        automatically scrolled before the first prompt appears (meaning free_lines +
        1 lines will be printed). This can be set to the cursor's y position - 2 to
        always try to fill the screen. Defaults to 0, meaning only one line is
        displayed before prompting.
        
        @returns The number of lines printed.
    */
    export function pagedPrint(text: string, free_lines?: number): number

    /**
        Prints tables in a structured form.
        
        This accepts multiple arguments, either a table or a number. When
        encountering a table, this will be treated as a table row, with each column
        width being auto-adjusted.
        
        When encountering a number, this sets the text color of the subsequent rows to it.
        
        @param ... The rows and text colors to display.
    */
    export function tabulate(..._: (string[] | number)[]): void

    /**
        Prints tables in a structured form, stopping and prompting for input should
        the result not fit on the terminal.
        
        This functions identically to textutils.tabulate, but will prompt for user
        input should the whole output not fit on the display.
        
        @param ... The rows and text colors to display.
    */
    export function pagedTabulate(..._: (string[] | number)[]): void

    /**
        A table representing an empty JSON array, in order to distinguish it from an
        empty JSON object.
        
        The contents of this table should not be modified.
    */
    export const empty_json_array: any

    /**
        A table representing the JSON null value.
        
        The contents of this table should not be modified.
    */
    export const json_null: any

    /**
        Convert a Lua object into a textual representation, suitable for
        saving in a file or pretty-printing.
        
        @param t The object to serialise
        @param opts Options for serialisation.
        
        compact: Do not emit indentation and other whitespace between terms.
        allow_repetitions: Relax the check for recursive tables, allowing them to appear multiple
        times (as long as tables do not appear inside themselves).
        
        @returns The serialised representation
        
        @throws If the object contains a value which cannot be
        serialised. This includes functions and tables which appear multiple
        times.
    */
    export function serialize(t: /*not provided*/ any, opts: { compact?: boolean, allow_repetitions?: boolean }): string

    /**
        Convert a Lua object into a textual representation, suitable for
        saving in a file or pretty-printing.
        
        @param t The object to serialise
        @param opts Options for serialisation.
        
        compact: Do not emit indentation and other whitespace between terms.
        allow_repetitions: Relax the check for recursive tables, allowing them to appear multiple
        times (as long as tables do not appear inside themselves).
        
        @returns The serialised representation
        
        @throws If the object contains a value which cannot be
        serialised. This includes functions and tables which appear multiple
        times.
    */
    export function serialise(t: /*not provided*/ any, opts: { compact?: boolean, allow_repetitions?: boolean }): string

    /**
        Converts a serialised string back into a reassembled Lua object.
        
        This is mainly used together with textutils.serialise.
        
        @param s The serialised string to deserialise.
        
        @returns The deserialised object
    */
    export function unserialize(s: string): /*not provided*/ any

    /**
        Converts a serialised string back into a reassembled Lua object.
        
        This is mainly used together with textutils.serialise.
        
        @param s The serialised string to deserialise.
        
        @returns The deserialised object
    */
    export function unserialise(s: string): /*not provided*/ any

    /**
        Returns a JSON representation of the given data.
        
        This function attempts to guess whether a table is a JSON array or
        object. However, empty tables are assumed to be empty objects - use
        textutils.empty_json_array to mark an empty array.
        
        This is largely intended for interacting with various functions from the
        commands API, though may also be used in making http requests.
        
        @param t The value to serialise. Like textutils.serialise, this should not
        contain recursive tables or functions.
        @param options? Options for serialisation.
        
        nbt_style: Whether to produce NBT-style JSON (non-quoted keys) instead of standard JSON.
        unicode_strings: Whether to treat strings as containing UTF-8 characters instead of
        using the default 8-bit character set.
        
        @returns The JSON representation of the input.
        
        @throws If the object contains a value which cannot be serialised. This includes
        functions and tables which appear multiple times.
    */
    export function serializeJSON(t: /*not provided*/ any, options?: { nbt_style?: boolean, unicode_strings?: boolean }): string

    /**
        Returns a JSON representation of the given data.
        
        This function attempts to guess whether a table is a JSON array or
        object. However, empty tables are assumed to be empty objects - use
        textutils.empty_json_array to mark an empty array.
        
        This is largely intended for interacting with various functions from the
        commands API, though may also be used in making http requests.
        
        @param t The value to serialise. Like textutils.serialise, this should not
        contain recursive tables or functions.
        @param options? Options for serialisation.
        
        nbt_style: Whether to produce NBT-style JSON (non-quoted keys) instead of standard JSON.
        unicode_strings: Whether to treat strings as containing UTF-8 characters instead of
        using the default 8-bit character set.
        
        @returns The JSON representation of the input.
        
        @throws If the object contains a value which cannot be serialised. This includes
        functions and tables which appear multiple times.
    */
    export function serialiseJSON(t: /*not provided*/ any, options?: { nbt_style?: boolean, unicode_strings?: boolean }): string

    /**
        Converts a serialised JSON string back into a reassembled Lua object.
        
        This may be used with textutils.serializeJSON, or when communicating
        with command blocks or web APIs.
        
        If a null value is encountered, it is converted into nil. It can be converted
        into textutils.json_null with the parse_null option.
        
        If an empty array is encountered, it is converted into textutils.empty_json_array.
        It can be converted into a new empty table with the parse_empty_array option.
        
        @param s The serialised string to deserialise.
        @param options? Options which control how this JSON object is parsed.
        
        nbt_style: When true, this will accept stringified NBT strings,
        as produced by many commands.
        parse_null: When true, null will be parsed as json_null, rather than
        nil.
        parse_empty_array: When false, empty arrays will be parsed as a new table.
        By default (or when this value is true), they are parsed as empty_json_array.
        
        @returns The deserialised object
    */
    export function unserializeJSON(s: string, options?: { nbt_style?: boolean, parse_null?: boolean, parse_empty_array?: boolean }): /*not provided*/ any

    /**
        Converts a serialised JSON string back into a reassembled Lua object.
        
        This may be used with textutils.serializeJSON, or when communicating
        with command blocks or web APIs.
        
        If a null value is encountered, it is converted into nil. It can be converted
        into textutils.json_null with the parse_null option.
        
        If an empty array is encountered, it is converted into textutils.empty_json_array.
        It can be converted into a new empty table with the parse_empty_array option.
        
        @param s The serialised string to deserialise.
        @param options? Options which control how this JSON object is parsed.
        
        nbt_style: When true, this will accept stringified NBT strings,
        as produced by many commands.
        parse_null: When true, null will be parsed as json_null, rather than
        nil.
        parse_empty_array: When false, empty arrays will be parsed as a new table.
        By default (or when this value is true), they are parsed as empty_json_array.
        
        @returns The deserialised object
    */
    export function unserialiseJSON(s: string, options?: { nbt_style?: boolean, parse_null?: boolean, parse_empty_array?: boolean }): /*not provided*/ any

    /**
        Replaces certain characters in a string to make it safe for use in URLs or POST data.
        
        @param str The string to encode
        
        @returns The encoded string.
    */
    export function urlEncode(str: string): string

    /**
        Provides a list of possible completions for a partial Lua expression.
        
        If the completed element is a table, suggestions will have . appended to
        them. Similarly, functions have ( appended to them.
        
        @param sSearchText The partial expression to complete, such as a
        variable name or table index.
        @param tSearchTable? The table to find variables in, defaulting to
        the global environment (_G). The function also searches the "parent"
        environment via the __index metatable field.
        
        @returns The (possibly empty) list of completions.
    */
    export function complete(sSearchText: string, tSearchTable?: object): string[]

}
/**
    Turtles are a robotic device, which can break and place blocks, attack mobs, and move about the world. They have
    an internal inventory of 16 slots, allowing them to store blocks they have broken or would like to place.
    
    [Documentation](https://tweaked.cc/module/turtle.html)
*/
declare namespace turtle {
    /**
        Craft a recipe based on the turtle's inventory.
        The turtle's inventory should set up like a crafting grid. For instance, to
        craft sticks, slots 1 and 5 should contain planks. All other slots should be
        empty, including those outside the crafting "grid".
        
        @param limit? = 64 The maximum number of crafting steps to run.
        
        @returns If crafting succeeds.
        
        @throws When limit is less than 1 or greater than 64.
    */
    export function craft(limit?: number): true

    /**
        Move the turtle forward one block.
        
        
        @returns Whether the turtle could successfully move.
        @returns The reason the turtle could not move.
    */
    export function forward(): LuaMultiReturn<[boolean, string | null]>

    /**
        Move the turtle backwards one block.
        
        
        @returns Whether the turtle could successfully move.
        @returns The reason the turtle could not move.
    */
    export function back(): LuaMultiReturn<[boolean, string | null]>

    /**
        Move the turtle up one block.
        
        
        @returns Whether the turtle could successfully move.
        @returns The reason the turtle could not move.
    */
    export function up(): LuaMultiReturn<[boolean, string | null]>

    /**
        Move the turtle down one block.
        
        
        @returns Whether the turtle could successfully move.
        @returns The reason the turtle could not move.
    */
    export function down(): LuaMultiReturn<[boolean, string | null]>

    /**
        Rotate the turtle 90 degrees to the left.
        
        
        @returns Whether the turtle could successfully turn.
        @returns The reason the turtle could not turn.
    */
    export function turnLeft(): LuaMultiReturn<[boolean, string | null]>

    /**
        Rotate the turtle 90 degrees to the right.
        
        
        @returns Whether the turtle could successfully turn.
        @returns The reason the turtle could not turn.
    */
    export function turnRight(): LuaMultiReturn<[boolean, string | null]>

    /**
        Attempt to break the block in front of the turtle.
        
        This requires a turtle tool capable of breaking the block. Diamond pickaxes
        (mining turtles) can break any vanilla block, but other tools (such as axes)
        are more limited.
        
        @param side? The specific tool to use. Should be "left" or "right".
        
        @returns Whether a block was broken.
        @returns The reason no block was broken.
    */
    export function dig(side?: string): LuaMultiReturn<[boolean, string | null]>

    /**
        Attempt to break the block above the turtle. See dig for full details.
        
        @param side? The specific tool to use.
        
        @returns Whether a block was broken.
        @returns The reason no block was broken.
    */
    export function digUp(side?: string): LuaMultiReturn<[boolean, string | null]>

    /**
        Attempt to break the block below the turtle. See dig for full details.
        
        @param side? The specific tool to use.
        
        @returns Whether a block was broken.
        @returns The reason no block was broken.
    */
    export function digDown(side?: string): LuaMultiReturn<[boolean, string | null]>

    /**
        Place a block or item into the world in front of the turtle.
        
        "Placing" an item allows it to interact with blocks and entities in front of the turtle. For instance, buckets
        can pick up and place down fluids, and wheat can be used to breed cows. However, you cannot use place to
        perform arbitrary block interactions, such as clicking buttons or flipping levers.
        
        @param text? When placing a sign, set its contents to this text.
        
        @returns Whether the block could be placed.
        @returns The reason the block was not placed.
    */
    export function place(text?: string): LuaMultiReturn<[boolean, string | null]>

    /**
        Place a block or item into the world above the turtle.
        
        @param text? When placing a sign, set its contents to this text.
        
        @returns Whether the block could be placed.
        @returns The reason the block was not placed.
    */
    export function placeUp(text?: string): LuaMultiReturn<[boolean, string | null]>

    /**
        Place a block or item into the world below the turtle.
        
        @param text? When placing a sign, set its contents to this text.
        
        @returns Whether the block could be placed.
        @returns The reason the block was not placed.
    */
    export function placeDown(text?: string): LuaMultiReturn<[boolean, string | null]>

    /**
        Drop the currently selected stack into the inventory in front of the turtle, or as an item into the world if
        there is no inventory.
        
        @param count? The number of items to drop. If not given, the entire stack will be dropped.
        
        @returns Whether items were dropped.
        @returns The reason the no items were dropped.
        
        @throws If dropping an invalid number of items.
    */
    export function drop(count?: number): LuaMultiReturn<[boolean, string | null]>

    /**
        Drop the currently selected stack into the inventory above the turtle, or as an item into the world if there is
        no inventory.
        
        @param count? The number of items to drop. If not given, the entire stack will be dropped.
        
        @returns Whether items were dropped.
        @returns The reason the no items were dropped.
        
        @throws If dropping an invalid number of items.
    */
    export function dropUp(count?: number): LuaMultiReturn<[boolean, string | null]>

    /**
        Drop the currently selected stack into the inventory below the turtle, or as an item into the world if
        there is no inventory.
        
        @param count? The number of items to drop. If not given, the entire stack will be dropped.
        
        @returns Whether items were dropped.
        @returns The reason the no items were dropped.
        
        @throws If dropping an invalid number of items.
    */
    export function dropDown(count?: number): LuaMultiReturn<[boolean, string | null]>

    /**
        Change the currently selected slot.
        
        The selected slot is determines what slot actions like drop or getItemCount act on.
        
        @param slot The slot to select.
        
        @returns When the slot has been selected.
        
        @throws If the slot is out of range.
    */
    export function select(slot: number): true

    /**
        Get the number of items in the given slot.
        
        @param slot? The slot we wish to check. Defaults to the selected slot.
        
        @returns The number of items in this slot.
        
        @throws If the slot is out of range.
    */
    export function getItemCount(slot?: number): number

    /**
        Get the remaining number of items which may be stored in this stack.
        
        For instance, if a slot contains 13 blocks of dirt, it has room for another 51.
        
        @param slot? The slot we wish to check. Defaults to the selected slot.
        
        @returns The space left in in this slot.
        
        @throws If the slot is out of range.
    */
    export function getItemSpace(slot?: number): number

    /**
        Check if there is a solid block in front of the turtle. In this case, solid refers to any non-air or liquid
        block.
        
        
        @returns If there is a solid block in front.
    */
    export function detect(): boolean

    /**
        Check if there is a solid block above the turtle. In this case, solid refers to any non-air or liquid block.
        
        
        @returns If there is a solid block above.
    */
    export function detectUp(): boolean

    /**
        Check if there is a solid block below the turtle. In this case, solid refers to any non-air or liquid block.
        
        
        @returns If there is a solid block below.
    */
    export function detectDown(): boolean

    /**
        Check if the block in front of the turtle is equal to the item in the currently selected slot.
        
        
        @returns If the block and item are equal.
    */
    export function compare(): boolean

    /**
        Check if the block above the turtle is equal to the item in the currently selected slot.
        
        
        @returns If the block and item are equal.
    */
    export function compareUp(): boolean

    /**
        Check if the block below the turtle is equal to the item in the currently selected slot.
        
        
        @returns If the block and item are equal.
    */
    export function compareDown(): boolean

    /**
        Attack the entity in front of the turtle.
        
        @param side? The specific tool to use.
        
        @returns Whether an entity was attacked.
        @returns The reason nothing was attacked.
    */
    export function attack(side?: string): LuaMultiReturn<[boolean, string | null]>

    /**
        Attack the entity above the turtle.
        
        @param side? The specific tool to use.
        
        @returns Whether an entity was attacked.
        @returns The reason nothing was attacked.
    */
    export function attackUp(side?: string): LuaMultiReturn<[boolean, string | null]>

    /**
        Attack the entity below the turtle.
        
        @param side? The specific tool to use.
        
        @returns Whether an entity was attacked.
        @returns The reason nothing was attacked.
    */
    export function attackDown(side?: string): LuaMultiReturn<[boolean, string | null]>

    /**
        Suck an item from the inventory in front of the turtle, or from an item floating in the world.
        
        This will pull items into the first acceptable slot, starting at the currently selected one.
        
        @param count? The number of items to suck. If not given, up to a stack of items will be picked up.
        
        @returns Whether items were picked up.
        @returns The reason the no items were picked up.
        
        @throws If given an invalid number of items.
    */
    export function suck(count?: number): LuaMultiReturn<[boolean, string | null]>

    /**
        Suck an item from the inventory above the turtle, or from an item floating in the world.
        
        @param count? The number of items to suck. If not given, up to a stack of items will be picked up.
        
        @returns Whether items were picked up.
        @returns The reason the no items were picked up.
        
        @throws If given an invalid number of items.
    */
    export function suckUp(count?: number): LuaMultiReturn<[boolean, string | null]>

    /**
        Suck an item from the inventory below the turtle, or from an item floating in the world.
        
        @param count? The number of items to suck. If not given, up to a stack of items will be picked up.
        
        @returns Whether items were picked up.
        @returns The reason the no items were picked up.
        
        @throws If given an invalid number of items.
    */
    export function suckDown(count?: number): LuaMultiReturn<[boolean, string | null]>

    /**
        Get the maximum amount of fuel this turtle currently holds.
        
        
        @returns The current amount of fuel a turtle this turtle has.
    */
    export function getFuelLevel(): number

    /**
        Refuel this turtle.
        
        While most actions a turtle can perform (such as digging or placing blocks) are free, moving consumes fuel from
        the turtle's internal buffer. If a turtle has no fuel, it will not move.
        
        refuel refuels the turtle, consuming fuel items (such as coal or lava buckets) from the currently
        selected slot and converting them into energy. This finishes once the turtle is fully refuelled or all items have
        been consumed.
        
        @param count? The maximum number of items to consume. One can pass 0 to check if an item is combustable or not.
        
        @returns If the turtle was refuelled.
        
        @throws If the refuel count is out of range.
    */
    export function refuel(count?: number): true

    /**
        Compare the item in the currently selected slot to the item in another slot.
        
        @param slot The slot to compare to.
        
        @returns If the two items are equal.
        
        @throws If the slot is out of range.
    */
    export function compareTo(slot: number): boolean

    /**
        Move an item from the selected slot to another one.
        
        @param slot The slot to move this item to.
        @param count? The maximum number of items to move.
        
        @returns If some items were successfully moved.
        
        @throws If the slot is out of range.
        If the number of items is out of range.
    */
    export function transferTo(slot: number, count?: number): boolean

    /**
        Get the currently selected slot.
        
        
        @returns The current slot.
    */
    export function getSelectedSlot(): number

    /**
        Get the maximum amount of fuel this turtle can hold.
        
        By default, normal turtles have a limit of 20,000 and advanced turtles of 100,000.
        
        
        @returns The maximum amount of fuel a turtle can hold.
    */
    export function getFuelLimit(): number

    /**
        Equip (or unequip) an item on the left side of this turtle.
        
        This finds the item in the currently selected slot and attempts to equip it to the left side of the turtle. The
        previous upgrade is removed and placed into the turtle's inventory. If there is no item in the slot, the previous
        upgrade is removed, but no new one is equipped.
        
        
        @returns If the item was equipped.
    */
    export function equipLeft(): true

    /**
        Equip (or unequip) an item on the right side of this turtle.
        
        This finds the item in the currently selected slot and attempts to equip it to the right side of the turtle. The
        previous upgrade is removed and placed into the turtle's inventory. If there is no item in the slot, the previous
        upgrade is removed, but no new one is equipped.
        
        
        @returns If the item was equipped.
    */
    export function equipRight(): true

    /**
        Get information about the block in front of the turtle.
        
        
        @returns Whether there is a block in front of the turtle.
        @returns Information about the block in front, or a message explaining that there is no block.
    */
    export function inspect(): LuaMultiReturn<[boolean, object | string]>

    /**
        Get information about the block above the turtle.
        
        
        @returns Whether there is a block above the turtle.
        @returns Information about the above below, or a message explaining that there is no block.
    */
    export function inspectUp(): LuaMultiReturn<[boolean, object | string]>

    /**
        Get information about the block below the turtle.
        
        
        @returns Whether there is a block below the turtle.
        @returns Information about the block below, or a message explaining that there is no block.
    */
    export function inspectDown(): LuaMultiReturn<[boolean, object | string]>

    /**
        Get detailed information about the items in the given slot.
        
        @param slot? The slot to get information about. Defaults to the selected slot.
        @param detailed? Whether to include "detailed" information. When true the method will contain much
        more information about the item at the cost of taking longer to run.
        
        @returns Information about the given slot, or nil if it is empty.
        
        @throws If the slot is out of range.
    */
    export function getItemDetail(slot?: number, detailed?: boolean): null | object

    /**
        🛈 DeprecatedHistorically this table behaved differently to the main turtle API, but this is no longer the case. You
        should not need to use it.
        
        
        The builtin turtle API, without any generated helper functions.
    */
    export const native: any

}
/**
    A basic 3D vector type and some common vector operations. This may be useful
    when working with coordinates in Minecraft's world (such as those from the
    gps API).
    
    [Documentation](https://tweaked.cc/module/vector.html)
*/
declare namespace vector {
    /**
        Construct a new Vector with the given coordinates.
        
        @param x The X coordinate or direction of the vector.
        @param y The Y coordinate or direction of the vector.
        @param z The Z coordinate or direction of the vector.
        
        @returns The constructed vector.
    */
    function __reserved__new(x: number, y: number, z: number): Vector

    /**
        A 3-dimensional vector, with x, y, and z values.
        
        This is suitable for representing both position and directional vectors.
    */
    export interface Vector {
        /**
            Adds two vectors together.
            
            @param o The second vector to add.
            
            @returns The resulting vector
        */
        add(o: Vector): Vector

        /**
            Subtracts one vector from another.
            
            @param o The vector to subtract.
            
            @returns The resulting vector
        */
        sub(o: Vector): Vector

        /**
            Multiplies a vector by a scalar value.
            
            @param m The scalar value to multiply with.
            
            @returns A vector with value (x * m, y * m, z * m).
        */
        mul(m: number): Vector

        /**
            Divides a vector by a scalar value.
            
            @param m The scalar value to divide by.
            
            @returns A vector with value (x / m, y / m, z / m).
        */
        div(m: number): Vector

        /**
            Negate a vector
            
            
            @returns The negated vector.
        */
        unm(): Vector

        /**
            Compute the dot product of two vectors
            
            @param o The second vector to compute the dot product of.
            
            @returns The dot product of self and o.
        */
        dot(o: Vector): Vector

        /**
            Compute the cross product of two vectors
            
            @param o The second vector to compute the cross product of.
            
            @returns The cross product of self and o.
        */
        cross(o: Vector): Vector

        /**
            Get the length (also referred to as magnitude) of this vector.
            
            
            @returns The length of this vector.
        */
        length(): number

        /**
            Divide this vector by its length, producing with the same direction, but
            of length 1.
            
            
            @returns The normalised vector
        */
        normalize(): Vector

        /**
            Construct a vector with each dimension rounded to the nearest value.
            
            @param tolerance? The tolerance that we should round to,
            defaulting to 1. For instance, a tolerance of 0.5 will round to the
            nearest 0.5.
            
            @returns The rounded vector.
        */
        round(tolerance?: number): Vector

        /**
            Convert this vector into a string, for pretty printing.
            
            
            @returns This vector's string representation.
        */
        tostring(): string

        /**
            Check for equality between two vectors.
            
            @param other The second vector to compare to.
            
            @returns Whether or not the vectors are equal.
        */
        equals(other: Vector): boolean

    }

    export { __reserved__new as new }
}
/**
    A terminal redirect occupying a smaller area of an
    existing terminal. This allows for easy definition of spaces within the display
    that can be written/drawn to, then later redrawn/repositioned/etc as need
    be. The API itself contains only one function, window.create, which returns
    the windows themselves.
    
    [Documentation](https://tweaked.cc/module/window.html)
*/
declare namespace window {
    /**
        Returns a terminal object that is a space within the specified parent
        terminal object. This can then be used (or even redirected to) in the same
        manner as eg a wrapped monitor. Refer to the term API for a list of
        functions available to it.
        
        term itself may not be passed as the parent, though term.native is
        acceptable. Generally, term.current or a wrapped monitor will be most
        suitable, though windows may even have other windows assigned as their
        parents.
        
        @param parent The parent terminal redirect to draw to.
        @param nX The x coordinate this window is drawn at in the parent terminal
        @param nY The y coordinate this window is drawn at in the parent terminal
        @param nWidth The width of this window
        @param nHeight The height of this window
        @param bStartVisible? Whether this window is visible by
        default. Defaults to true.
        
        @returns The constructed window
    */
    export function create(parent: term.Redirect, nX: number, nY: number, nWidth: number, nHeight: number, bStartVisible?: boolean): Window

    /**
        The window object. Refer to the module's documentation for
        a full description.
        
        See also
        
        term.Redirect 
    */
    export interface Window {
        /**
            
            
            @param sText 
        */
        write(sText: /*not provided*/ any): void

        /**
            
            
            @param sText 
            @param sTextColor 
            @param sBackgroundColor 
        */
        blit(sText: /*not provided*/ any, sTextColor: /*not provided*/ any, sBackgroundColor: /*not provided*/ any): void

        /**
            
            
        */
        clear(): void

        /**
            
            
        */
        clearLine(): void

        /**
            
            
        */
        getCursorPos(): void

        /**
            
            
            @param x 
            @param y 
        */
        setCursorPos(x: /*not provided*/ any, y: /*not provided*/ any): void

        /**
            
            
            @param blink 
        */
        setCursorBlink(blink: /*not provided*/ any): void

        /**
            
            
        */
        getCursorBlink(): void

        /**
            
            
        */
        isColor(): void

        /**
            
            
        */
        isColour(): void

        /**
            
            
            @param color 
        */
        setTextColor(color: /*not provided*/ any): void

        /**
            
            
            @param color 
        */
        setTextColour(color: /*not provided*/ any): void

        /**
            
            
            @param colour 
            @param r 
            @param g 
            @param b 
        */
        setPaletteColour(colour: /*not provided*/ any, r: /*not provided*/ any, g: /*not provided*/ any, b: /*not provided*/ any): void

        /**
            
            
            @param colour 
            @param r 
            @param g 
            @param b 
        */
        setPaletteColor(colour: /*not provided*/ any, r: /*not provided*/ any, g: /*not provided*/ any, b: /*not provided*/ any): void

        /**
            
            
            @param colour 
        */
        getPaletteColour(colour: /*not provided*/ any): void

        /**
            
            
            @param colour 
        */
        getPaletteColor(colour: /*not provided*/ any): void

        /**
            
            
            @param color 
        */
        setBackgroundColor(color: /*not provided*/ any): void

        /**
            
            
            @param color 
        */
        setBackgroundColour(color: /*not provided*/ any): void

        /**
            
            
        */
        getSize(): void

        /**
            
            
            @param n 
        */
        scroll(n: /*not provided*/ any): void

        /**
            
            
        */
        getTextColor(): void

        /**
            
            
        */
        getTextColour(): void

        /**
            
            
        */
        getBackgroundColor(): void

        /**
            
            
        */
        getBackgroundColour(): void

        /**
            Get the buffered contents of a line in this window.
            
            @param y The y position of the line to get.
            
            @returns The textual content of this line.
            @returns The text colours of this line, suitable for use with term.blit.
            @returns The background colours of this line, suitable for use with term.blit.
            
            @throws If y is not between 1 and this window's height.
        */
        getLine(y: number): LuaMultiReturn<[string, string, string]>

        /**
            Set whether this window is visible. Invisible windows will not be drawn
            to the screen until they are made visible again.
            
            Making an invisible window visible will immediately draw it.
            
            @param visible Whether this window is visible.
        */
        setVisible(visible: boolean): void

        /**
            Get whether this window is visible. Invisible windows will not be
            drawn to the screen until they are made visible again.
            
            
            @returns Whether this window is visible.
        */
        isVisible(): boolean

        /**
            Draw this window. This does nothing if the window is not visible.
            
        */
        redraw(): void

        /**
            Set the current terminal's cursor to where this window's cursor is. This
            does nothing if the window is not visible.
            
        */
        restoreCursor(): void

        /**
            Get the position of the top left corner of this window.
            
            
            @returns The x position of this window.
            @returns The y position of this window.
        */
        getPosition(): LuaMultiReturn<[number, number]>

        /**
            Reposition or resize the given window.
            
            This function also accepts arguments to change the size of this window.
            It is recommended that you fire a term_resize event after changing a
            window's, to allow programs to adjust their sizing.
            
            @param new_x The new x position of this window.
            @param new_y The new y position of this window.
            @param new_width? The new width of this window.
            @param new_height The new height of this window.
            @param new_parent? The new redirect object this
            window should draw to.
        */
        reposition(new_x: number, new_y: number, new_width?: number, new_height?: number, new_parent?: term.Redirect): void

    }

}
/**
    This peripheral allows you to interact with command blocks.
    
    [Documentation](https://tweaked.cc/peripheral/command.html)
*/
interface command {
    /**
        Get the command this command block will run.
        
        
        @returns The current command.
    */
    /** @noSelf */
    getCommand(): string

    /**
        Set the command block's command.
        
        @param command The new command.
    */
    /** @noSelf */
    setCommand(command: string): void

    /**
        Execute the command block once.
        
        
        @returns If the command completed successfully.
        @returns A failure message.
    */
    /** @noSelf */
    runCommand(): LuaMultiReturn<[boolean, string | null]>

}
/**
    A computer or turtle wrapped as a peripheral.
    
    [Documentation](https://tweaked.cc/peripheral/computer.html)
*/
interface computer {
    /**
        Turn the other computer on.
        
    */
    /** @noSelf */
    turnOn(): void

    /**
        Shutdown the other computer.
        
    */
    /** @noSelf */
    shutdown(): void

    /**
        Reboot or turn on the other computer.
        
    */
    /** @noSelf */
    reboot(): void

    /**
        Get the other computer's ID.
        
        
        @returns The computer's ID.
    */
    /** @noSelf */
    getID(): number

    /**
        Determine if the other computer is on.
        
        
        @returns If the computer is on.
    */
    /** @noSelf */
    isOn(): boolean

    /**
        Get the other computer's label.
        
        
        @returns The computer's label.
    */
    /** @noSelf */
    getLabel(): string | null

}
/**
    Disk drives are a peripheral which allow you to read and write to floppy disks and other "mountable media" (such as
    computers or turtles). They also allow you to play records.
    
    [Documentation](https://tweaked.cc/peripheral/drive.html)
*/
interface drive {
    /**
        Returns whether a disk is currently inserted in the drive.
        
        
        @returns Whether a disk is currently inserted in the drive.
    */
    /** @noSelf */
    isDiskPresent(): boolean

    /**
        Returns the label of the disk in the drive if available.
        
        
        @returns The label of the disk, or nil if either no disk is inserted or the disk doesn't have a label.
    */
    /** @noSelf */
    getDiskLabel(): string | null

    /**
        Sets or clears the label for a disk.
        
        If no label or nil is passed, the label will be cleared.
        
        If the inserted disk's label can't be changed (for example, a record),
        an error will be thrown.
        
        @param label? The new label of the disk, or nil to clear.
        
        @throws If the disk's label can't be changed.
    */
    /** @noSelf */
    setDiskLabel(label?: string): void

    /**
        Returns whether a disk with data is inserted.
        
        
        @returns Whether a disk with data is inserted.
    */
    /** @noSelf */
    hasData(): boolean

    /**
        Returns the mount path for the inserted disk.
        
        
        @returns The mount path for the disk, or nil if no data disk is inserted.
    */
    /** @noSelf */
    getMountPath(): string | null

    /**
        Returns whether a disk with audio is inserted.
        
        
        @returns Whether a disk with audio is inserted.
    */
    /** @noSelf */
    hasAudio(): boolean

    /**
        Returns the title of the inserted audio disk.
        
        
        @returns The title of the audio, false if no disk is inserted, or nil if the disk has no audio.
    */
    /** @noSelf */
    getAudioTitle(): string | null | false

    /**
        Plays the audio in the inserted disk, if available.
        
    */
    /** @noSelf */
    playAudio(): void

    /**
        Stops any audio that may be playing.
        
    */
    /** @noSelf */
    stopAudio(): void

    /**
        Ejects any disk that may be in the drive.
        
    */
    /** @noSelf */
    ejectDisk(): void

    /**
        Returns the ID of the disk inserted in the drive.
        
        
        @returns The ID of the disk in the drive, or nil if no disk with an ID is inserted.
    */
    /** @noSelf */
    getDiskID(): number | null

}
/**
    Modems allow you to send messages between computers over long distances.
    
    [Documentation](https://tweaked.cc/peripheral/modem.html)
*/
interface modem {
    /**
        Open a channel on a modem. A channel must be open in order to receive messages. Modems can have up to 128
        channels open at one time.
        
        @param channel The channel to open. This must be a number between 0 and 65535.
        
        @throws If the channel is out of range.
        If there are too many open channels.
    */
    /** @noSelf */
    open(channel: number): void

    /**
        Check if a channel is open.
        
        @param channel The channel to check.
        
        @returns Whether the channel is open.
        
        @throws If the channel is out of range.
    */
    /** @noSelf */
    isOpen(channel: number): boolean

    /**
        Close an open channel, meaning it will no longer receive messages.
        
        @param channel The channel to close.
        
        @throws If the channel is out of range.
    */
    /** @noSelf */
    close(channel: number): void

    /**
        Close all open channels.
        
    */
    /** @noSelf */
    closeAll(): void

    /**
        Sends a modem message on a certain channel. Modems listening on the channel will queue a modem_message
        event on adjacent computers.
        
        🛈 noteThe channel does not need be open to send a message.
        
        
        @param channel The channel to send messages on.
        @param replyChannel The channel that responses to this message should be sent on. This can be the same as
        channel or entirely different. The channel must have been opened on
        the sending computer in order to receive the replies.
        @param payload The object to send. This can be any primitive type (boolean, number, string) as well as
        tables. Other types (like functions), as well as metatables, will not be transmitted.
        
        @throws If the channel is out of range.
    */
    /** @noSelf */
    transmit(channel: number, replyChannel: number, payload: any): void

    /**
        Determine if this is a wired or wireless modem.
        
        Some methods (namely those dealing with wired networks and remote peripherals) are only available on wired
        modems.
        
        
        @returns true if this is a wireless modem.
    */
    /** @noSelf */
    isWireless(): boolean

    /**
        List all remote peripherals on the wired network.
        
        If this computer is attached to the network, it will not be included in
        this list.
        
        🛈 noteThis function only appears on wired modems. Check isWireless returns false before calling it.
        
        
        
        @returns Remote peripheral names on the network.
    */
    /** @noSelf */
    getNamesRemote(): string[]

    /**
        Determine if a peripheral is available on this wired network.
        
        🛈 noteThis function only appears on wired modems. Check isWireless returns false before calling it.
        
        
        @param name The peripheral's name.
        
        @returns boolean If a peripheral is present with the given name.
    */
    /** @noSelf */
    isPresentRemote(name: string): boolean

    /**
        Get the type of a peripheral is available on this wired network.
        
        🛈 noteThis function only appears on wired modems. Check isWireless returns false before calling it.
        
        
        @param name The peripheral's name.
        
        @returns The peripheral's type, or nil if it is not present.
    */
    /** @noSelf */
    getTypeRemote(name: string): string | null

    /**
        Check a peripheral is of a particular type.
        
        🛈 noteThis function only appears on wired modems. Check isWireless returns false before calling it.
        
        
        @param name The peripheral's name.
        @param type The type to check.
        
        @returns If a peripheral has a particular type, or nil if it is not present.
    */
    /** @noSelf */
    hasTypeRemote(name: string, type: string): boolean | null

    /**
        Get all available methods for the remote peripheral with the given name.
        
        🛈 noteThis function only appears on wired modems. Check isWireless returns false before calling it.
        
        
        @param name The peripheral's name.
        
        @returns A list of methods provided by this peripheral, or nil if it is not present.
    */
    /** @noSelf */
    getMethodsRemote(name: string): string[] | null

    /**
        Call a method on a peripheral on this wired network.
        
        🛈 noteThis function only appears on wired modems. Check isWireless returns false before calling it.
        
        
        @param remoteName The name of the peripheral to invoke the method on.
        @param method The name of the method
        @param ... Additional arguments to pass to the method
        
        @returns The return values of the peripheral method.
    */
    /** @noSelf */
    callRemote(remoteName: string, method: string, ..._: /*not provided*/ any[]): string

    /**
        Returns the network name of the current computer, if the modem is on. This
        may be used by other computers on the network to wrap this computer as a
        peripheral.
        
        🛈 noteThis function only appears on wired modems. Check isWireless returns false before calling it.
        
        
        
        @returns The current computer's name on the wired network.
    */
    /** @noSelf */
    getNameLocal(): string | null

}
/**
    Monitors are a block which act as a terminal, displaying information on one side. This allows them to be read and
    interacted with in-world without opening a GUI.
    
    [Documentation](https://tweaked.cc/peripheral/monitor.html)
*/
interface monitor {
    /**
        Set the scale of this monitor. A larger scale will result in the monitor having a lower resolution, but display
        text much larger.
        
        @param scale The monitor's scale. This must be a multiple of 0.5 between 0.5 and 5.
        
        @throws If the scale is out of range.
    */
    /** @noSelf */
    setTextScale(scale: number): void

    /**
        Get the monitor's current text scale.
        
        
        @returns The monitor's current scale.
        
        @throws If the monitor cannot be found.
    */
    /** @noSelf */
    getTextScale(): number

    /**
        Write text at the current cursor position, moving the cursor to the end of the text.
        
        Unlike functions like write and print, this does not wrap the text - it simply copies the
        text to the current terminal line.
        
        @param text The text to write.
    */
    /** @noSelf */
    write(text: string): void

    /**
        Move all positions up (or down) by y pixels.
        
        Every pixel in the terminal will be replaced by the line y pixels below it. If y is negative, it
        will copy pixels from above instead.
        
        @param y The number of lines to move up by. This may be a negative number.
    */
    /** @noSelf */
    scroll(y: number): void

    /**
        Get the position of the cursor.
        
        
        @returns The x position of the cursor.
        @returns The y position of the cursor.
    */
    /** @noSelf */
    getCursorPos(): LuaMultiReturn<[number, number]>

    /**
        Set the position of the cursor. terminal writes will begin from this position.
        
        @param x The new x position of the cursor.
        @param y The new y position of the cursor.
    */
    /** @noSelf */
    setCursorPos(x: number, y: number): void

    /**
        Checks if the cursor is currently blinking.
        
        
        @returns If the cursor is blinking.
    */
    /** @noSelf */
    getCursorBlink(): boolean

    /**
        Sets whether the cursor should be visible (and blinking) at the current cursor position.
        
        @param blink Whether the cursor should blink.
    */
    /** @noSelf */
    setCursorBlink(blink: boolean): void

    /**
        Get the size of the terminal.
        
        
        @returns The terminal's width.
        @returns The terminal's height.
    */
    /** @noSelf */
    getSize(): LuaMultiReturn<[number, number]>

    /**
        Clears the terminal, filling it with the current background colour.
        
    */
    /** @noSelf */
    clear(): void

    /**
        Clears the line the cursor is currently on, filling it with the current background
        colour.
        
    */
    /** @noSelf */
    clearLine(): void

    /**
        Return the colour that new text will be written as.
        
        
        @returns The current text colour.
    */
    /** @noSelf */
    getTextColour(): number

    /**
        Return the colour that new text will be written as.
        
        
        @returns The current text colour.
    */
    /** @noSelf */
    getTextColor(): number

    /**
        Set the colour that new text will be written as.
        
        @param colour The new text colour.
    */
    /** @noSelf */
    setTextColour(colour: number): void

    /**
        Set the colour that new text will be written as.
        
        @param colour The new text colour.
    */
    /** @noSelf */
    setTextColor(colour: number): void

    /**
        Return the current background colour. This is used when writing text and clearing
        the terminal.
        
        
        @returns The current background colour.
    */
    /** @noSelf */
    getBackgroundColour(): number

    /**
        Return the current background colour. This is used when writing text and clearing
        the terminal.
        
        
        @returns The current background colour.
    */
    /** @noSelf */
    getBackgroundColor(): number

    /**
        Set the current background colour. This is used when writing text and clearing the
        terminal.
        
        @param colour The new background colour.
    */
    /** @noSelf */
    setBackgroundColour(colour: number): void

    /**
        Set the current background colour. This is used when writing text and clearing the
        terminal.
        
        @param colour The new background colour.
    */
    /** @noSelf */
    setBackgroundColor(colour: number): void

    /**
        Determine if this terminal supports colour.
        
        Terminals which do not support colour will still allow writing coloured text/backgrounds, but it will be
        displayed in greyscale.
        
        
        @returns Whether this terminal supports colour.
    */
    /** @noSelf */
    isColour(): boolean

    /**
        Determine if this terminal supports colour.
        
        Terminals which do not support colour will still allow writing coloured text/backgrounds, but it will be
        displayed in greyscale.
        
        
        @returns Whether this terminal supports colour.
    */
    /** @noSelf */
    isColor(): boolean

    /**
        Writes text to the terminal with the specific foreground and background colours.
        
        As with write, the text will be written at the current cursor location, with the cursor
        moving to the end of the text.
        
        textColour and backgroundColour must both be strings the same length as text. All
        characters represent a single hexadecimal digit, which is converted to one of CC's colours. For instance,
        "a" corresponds to purple.
        
        @param text The text to write.
        @param textColour The corresponding text colours.
        @param backgroundColour The corresponding background colours.
        
        @throws If the three inputs are not the same length.
    */
    /** @noSelf */
    blit(text: string, textColour: string, backgroundColour: string): void

    /**
        Set the palette for a specific colour.
        
        ComputerCraft's palette system allows you to change how a specific colour should be displayed. For instance, you
        can make colors.red more red by setting its palette to #FF0000. This does now allow you to draw more
        colours - you are still limited to 16 on the screen at one time - but you can change which colours are
        used.
        
        @param index The colour whose palette should be changed.
        @param colour A 24-bit integer representing the RGB value of the colour. For instance the integer
        0xFF0000 corresponds to the colour #FF0000.
    */
    /** @noSelf */
    setPaletteColour(index: number, colour: number): void

    /**
        Set the palette for a specific colour.
        
        ComputerCraft's palette system allows you to change how a specific colour should be displayed. For instance, you
        can make colors.red more red by setting its palette to #FF0000. This does now allow you to draw more
        colours - you are still limited to 16 on the screen at one time - but you can change which colours are
        used.
        
        @param index The colour whose palette should be changed.
        @param colour A 24-bit integer representing the RGB value of the colour. For instance the integer
        0xFF0000 corresponds to the colour #FF0000.
    */
    /** @noSelf */
    setPaletteColor(index: number, colour: number): void

    /**
        Get the current palette for a specific colour.
        
        @param colour The colour whose palette should be fetched.
        
        @returns The red channel, will be between 0 and 1.
        @returns The green channel, will be between 0 and 1.
        @returns The blue channel, will be between 0 and 1.
    */
    /** @noSelf */
    getPaletteColour(colour: number): LuaMultiReturn<[number, number, number]>

    /**
        Get the current palette for a specific colour.
        
        @param colour The colour whose palette should be fetched.
        
        @returns The red channel, will be between 0 and 1.
        @returns The green channel, will be between 0 and 1.
        @returns The blue channel, will be between 0 and 1.
    */
    /** @noSelf */
    getPaletteColor(colour: number): LuaMultiReturn<[number, number, number]>

}
/**
    The printer peripheral allows pages and books to be printed.
    
    [Documentation](https://tweaked.cc/peripheral/printer.html)
*/
interface printer {
    /**
        Writes text to the current page.
        
        @param text The value to write to the page.
        
        @throws If any values couldn't be converted to a string, or if no page is started.
    */
    /** @noSelf */
    write(text: string): void

    /**
        Returns the current position of the cursor on the page.
        
        
        @returns The X position of the cursor.
        @returns The Y position of the cursor.
        
        @throws If a page isn't being printed.
    */
    /** @noSelf */
    getCursorPos(): LuaMultiReturn<[number, number]>

    /**
        Sets the position of the cursor on the page.
        
        @param x The X coordinate to set the cursor at.
        @param y The Y coordinate to set the cursor at.
        
        @throws If a page isn't being printed.
    */
    /** @noSelf */
    setCursorPos(x: number, y: number): void

    /**
        Returns the size of the current page.
        
        
        @returns The width of the page.
        @returns The height of the page.
        
        @throws If a page isn't being printed.
    */
    /** @noSelf */
    getPageSize(): LuaMultiReturn<[number, number]>

    /**
        Starts printing a new page.
        
        
        @returns Whether a new page could be started.
    */
    /** @noSelf */
    newPage(): boolean

    /**
        Finalizes printing of the current page and outputs it to the tray.
        
        
        @returns Whether the page could be successfully finished.
        
        @throws If a page isn't being printed.
    */
    /** @noSelf */
    endPage(): boolean

    /**
        Sets the title of the current page.
        
        @param title? The title to set for the page.
        
        @throws If a page isn't being printed.
    */
    /** @noSelf */
    setPageTitle(title?: string): void

    /**
        Returns the amount of ink left in the printer.
        
        
        @returns The amount of ink available to print with.
    */
    /** @noSelf */
    getInkLevel(): number

    /**
        Returns the amount of paper left in the printer.
        
        
        @returns The amount of paper available to print with.
    */
    /** @noSelf */
    getPaperLevel(): number

}
/**
    The speaker peripheral allows your computer to play notes and other sounds.
    
    [Documentation](https://tweaked.cc/peripheral/speaker.html)
*/
interface speaker {
    /**
        Plays a note block note through the speaker.
        
        This takes the name of a note to play, as well as optionally the volume
        and pitch to play the note at.
        
        The pitch argument uses semitones as the unit. This directly maps to the
        number of clicks on a note block. For reference, 0, 12, and 24 map to F#,
        and 6 and 18 map to C.
        
        A maximum of 8 notes can be played in a single tick. If this limit is hit, this function will return
        false.
        
        @param instrument The instrument to use to play this note.
        @param volume? The volume to play the note at, from 0.0 to 3.0. Defaults to 1.0.
        @param pitch? The pitch to play the note at in semitones, from 0 to 24. Defaults to 12.
        
        @returns Whether the note could be played as the limit was reached.
        
        @throws If the instrument doesn't exist.
    */
    /** @noSelf */
    playNote(instrument: string, volume?: number, pitch?: number): boolean

    /**
        Plays a Minecraft sound through the speaker.
        
        This takes the name of a Minecraft sound, such as
        "minecraft:block.note_block.harp", as well as an optional volume and pitch.
        
        Only one sound can be played at once. This function will return false if another sound was started
        this tick, or if some audio is still playing.
        
        @param name The name of the sound to play.
        @param volume? The volume to play the sound at, from 0.0 to 3.0. Defaults to 1.0.
        @param pitch? The speed to play the sound at, from 0.5 to 2.0. Defaults to 1.0.
        
        @returns Whether the sound could be played.
        
        @throws If the sound name was invalid.
    */
    /** @noSelf */
    playSound(name: string, volume?: number, pitch?: number): boolean

    /**
        Attempt to stream some audio data to the speaker.
        
        This accepts a list of audio samples as amplitudes between -128 and 127. These are stored in an internal buffer
        and played back at 48kHz. If this buffer is full, this function will return false. You should wait for
        a speaker_audio_empty event before trying again.
        
        🛈 noteThe speaker only buffers a single call to playAudio at once. This means if you try to play a small
        number of samples, you'll have a lot of stutter. You should try to play as many samples in one call as possible
        (up to 128×1024), as this reduces the chances of audio stuttering or halting, especially when the server or
        computer is lagging.
        
        
        Playing audio with speakers provides a more complete guide to using speakers
        
        @param audio A list of amplitudes.
        @param volume? The volume to play this audio at. If not given, defaults to the previous volume
        given to playAudio.
        
        @returns If there was room to accept this audio data.
        
        @throws If the audio data is malformed.
    */
    /** @noSelf */
    playAudio(audio: number[], volume?: number): boolean

    /**
        Stop all audio being played by this speaker.
        
        This clears any audio that playAudio had queued and stops the latest sound played by playSound.
        
    */
    /** @noSelf */
    stop(): void

}
/**
    Methods for interacting with blocks using Forge's energy storage system.
    
    [Documentation](https://tweaked.cc/generic_peripheral/energy_storage.html)
*/
interface energy_storage {
    /**
        Get the energy of this block.
        
        
        @returns The energy stored in this block, in FE.
    */
    /** @noSelf */
    getEnergy(): number

    /**
        Get the maximum amount of energy this block can store.
        
        
        @returns The energy capacity of this block.
    */
    /** @noSelf */
    getEnergyCapacity(): number

}
/**
    Methods for interacting with tanks and other fluid storage blocks.
    
    [Documentation](https://tweaked.cc/generic_peripheral/fluid_storage.html)
*/
interface fluid_storage {
    /**
        Get all "tanks" in this fluid storage.
        
        Each tank either contains some amount of fluid or is empty. Tanks with fluids inside will return some basic
        information about the fluid, including its name and amount.
        
        The returned table is sparse, and so empty tanks will be nil - it is recommended to loop over using pairs
        rather than ipairs.
        
        
        @returns All tanks in this fluid storage.
    */
    /** @noSelf */
    tanks(): object | null[]

    /**
        Move a fluid from one fluid container to another connected one.
        
        This allows you to pull fluid in the current fluid container to another container on the same wired
        network. Both containers must attached to wired modems which are connected via a cable.
        
        @param toName The name of the peripheral/container to push to. This is the string given to peripheral.wrap,
        and displayed by the wired modem.
        @param limit? The maximum amount of fluid to move.
        @param fluidName? The fluid to move. If not given, an arbitrary fluid will be chosen.
        
        @returns The amount of moved fluid.
        
        @throws If the peripheral to transfer to doesn't exist or isn't an fluid container.
    */
    /** @noSelf */
    pushFluid(toName: string, limit?: number, fluidName?: string): number

    /**
        Move a fluid from a connected fluid container into this oneone.
        
        This allows you to pull fluid in the current fluid container from another container on the same wired
        network. Both containers must attached to wired modems which are connected via a cable.
        
        @param fromName The name of the peripheral/container to push to. This is the string given to peripheral.wrap,
        and displayed by the wired modem.
        @param limit? The maximum amount of fluid to move.
        @param fluidName? The fluid to move. If not given, an arbitrary fluid will be chosen.
        
        @returns The amount of moved fluid.
        
        @throws If the peripheral to transfer to doesn't exist or isn't an fluid container.
    */
    /** @noSelf */
    pullFluid(fromName: string, limit?: number, fluidName?: string): number

}
/**
    Methods for interacting with inventories.
    
    [Documentation](https://tweaked.cc/generic_peripheral/inventory.html)
*/
interface inventory {
    /**
        Get the size of this inventory.
        
        
        @returns The number of slots in this inventory.
    */
    /** @noSelf */
    size(): number

    /**
        List all items in this inventory. This returns a table, with an entry for each slot.
        
        Each item in the inventory is represented by a table containing some basic information, much like
        turtle.getItemDetail
        includes. More information can be fetched with getItemDetail. The table contains the item name, the
        count and an a (potentially nil) hash of the item's nbt. This NBT data doesn't contain anything useful, but
        allows you to distinguish identical items.
        
        The returned table is sparse, and so empty slots will be nil - it is recommended to loop over using pairs
        rather than ipairs.
        
        
        @returns All items in this inventory.
    */
    /** @noSelf */
    list(): object | null[]

    /**
        Get detailed information about an item.
        
        The returned information contains the same information as each item in
        list, as well as additional details like the display name
        (displayName), and item and item durability (damage, maxDamage, durability).
        
        Some items include more information (such as enchantments) - it is
        recommended to print it out using textutils.serialize or in the Lua
        REPL, to explore what is available.
        
        🛈 Deprecated fieldsOlder versions of CC: Tweaked exposed an itemGroups field, listing the
        creative tabs an item was available under. This information is no longer available on
        more recent versions of the game, and so this field will always be empty. Do not use this
        field in new code!
        
        
        @param slot The slot to get information about.
        
        @returns Information about the item in this slot, or nil if not present.
        
        @throws If the slot is out of range.
    */
    /** @noSelf */
    getItemDetail(slot: number): object

    /**
        Get the maximum number of items which can be stored in this slot.
        
        Typically this will be limited to 64 items. However, some inventories (such as barrels or caches) can store
        hundreds or thousands of items in one slot.
        
        @param slot The slot
        
        @returns The maximum number of items in this slot.
        
        @throws If the slot is out of range.
    */
    /** @noSelf */
    getItemLimit(slot: number): number

    /**
        Push items from one inventory to another connected one.
        
        This allows you to push an item in an inventory to another inventory on the same wired network. Both
        inventories must attached to wired modems which are connected via a cable.
        
        @param toName The name of the peripheral/inventory to push to. This is the string given to peripheral.wrap,
        and displayed by the wired modem.
        @param fromSlot The slot in the current inventory to move items to.
        @param limit? The maximum number of items to move. Defaults to the current stack limit.
        @param toSlot? The slot in the target inventory to move to. If not given, the item will be inserted into any slot.
        
        @returns The number of transferred items.
        
        @throws If the peripheral to transfer to doesn't exist or isn't an inventory.
        If either source or destination slot is out of range.
    */
    /** @noSelf */
    pushItems(toName: string, fromSlot: number, limit?: number, toSlot?: number): number

    /**
        Pull items from a connected inventory into this one.
        
        This allows you to transfer items between inventories on the same wired network. Both this and the source
        inventory must attached to wired modems which are connected via a cable.
        
        @param fromName The name of the peripheral/inventory to pull from. This is the string given to peripheral.wrap,
        and displayed by the wired modem.
        @param fromSlot The slot in the source inventory to move items from.
        @param limit? The maximum number of items to move. Defaults to the current stack limit.
        @param toSlot? The slot in current inventory to move to. If not given, the item will be inserted into any slot.
        
        @returns The number of transferred items.
        
        @throws If the peripheral to transfer to doesn't exist or isn't an inventory.
        If either source or destination slot is out of range.
    */
    /** @noSelf */
    pullItems(fromName: string, fromSlot: number, limit?: number, toSlot?: number): number

}
/**
    The alarm event is fired when an alarm started with os.setAlarm completes.
    
    [Documentation](https://tweaked.cc/event/alarm.html)
*/
interface alarm {
    /**
    The event name.
    */
    "0": "alarm"
    /**
    The ID of the alarm that finished.
    */
    "1": number
}
/**
    The char event is fired when a character is typed on the keyboard.
    
    [Documentation](https://tweaked.cc/event/char.html)
*/
interface char {
    /**
    The event name.
    */
    "0": "char"
    /**
    The string representing the character that was pressed.
    */
    "1": string
}
/**
    The computer_command event is fired when the /computercraft queue command is run for the current computer.
    
    [Documentation](https://tweaked.cc/event/computer_command.html)
*/
interface computer_command {
    /**
    The event name.
    */
    "0": "computer_command"
    /**
    The arguments passed to the command.
    */
    "1": string[]
}
/**
    The disk event is fired when a disk is inserted into an adjacent or networked disk drive.
    
    [Documentation](https://tweaked.cc/event/disk.html)
*/
interface disk {
    /**
    The event name.
    */
    "0": "disk"
    /**
    The side of the disk drive that had a disk inserted.
    */
    "1": string
}
/**
    The disk_eject event is fired when a disk is removed from an adjacent or networked disk drive.
    
    [Documentation](https://tweaked.cc/event/disk_eject.html)
*/
interface disk_eject {
    /**
    The event name.
    */
    "0": "disk_eject"
    /**
    The side of the disk drive that had a disk removed.
    */
    "1": string
}
/**
    The file_transfer event is queued when a user drags-and-drops a file on an open computer.
    
    [Documentation](https://tweaked.cc/event/file_transfer.html)
*/
declare namespace file_transfer {
    /**
        A binary file handle that has been transferred to this computer.
        
        This inherits all methods of binary file handles, meaning you can use the standard
        read functions to access the contents of the file.
        
        See also
        
        fs.BinaryReadHandle 
    */
    export interface TransferredFile {
        /**
            Get the name of this file being transferred.
            
            
            @returns The file's name.
        */
        getName(): string

    }

    /**
        A list of files that have been transferred to this computer.
    */
    export interface TransferredFiles {
        /**
            All the files that are being transferred to this computer.
            
            
            @returns The list of files.
        */
        getFiles(): file_transfer.TransferredFile[]

    }

}
interface file_transfer {
    /**
    The event name
    */
    "0": "file_transfer"
    /**
    The list of transferred files.
    */
    "1": file_transfer.TransferredFiles
}
/**
    The http_check event is fired when a URL check finishes.
    
    [Documentation](https://tweaked.cc/event/http_check.html)
*/
interface http_check {
    /**
    The event name.
    */
    "0": "http_check"
    /**
    The URL requested to be checked.
    */
    "1": string
    /**
    Whether the check succeeded.
    */
    "2": boolean
    /**
    If the check failed, a reason explaining why the check failed.
    */
    "3": string | null
}
/**
    The http_failure event is fired when an HTTP request fails.
    
    [Documentation](https://tweaked.cc/event/http_failure.html)
*/
interface http_failure {
    /**
    The event name.
    */
    "0": "http_failure"
    /**
    The URL of the site requested.
    */
    "1": string
    /**
    An error describing the failure.
    */
    "2": string
    /**
    A response handle if the connection succeeded, but the server's
           response indicated failure.
    */
    "3": http.Response | null
}
/**
    The http_success event is fired when an HTTP request returns successfully.
    
    [Documentation](https://tweaked.cc/event/http_success.html)
*/
interface http_success {
    /**
    The event name.
    */
    "0": "http_success"
    /**
    The URL of the site requested.
    */
    "1": string
    /**
    The successful HTTP response.
    */
    "2": http.Response
}
/**
    This event is fired when any key is pressed while the terminal is focused.
    
    [Documentation](https://tweaked.cc/event/key.html)
*/
interface key {
    /**
    The event name.
    */
    "0": "key"
    /**
    The numerical key value of the key pressed.
    */
    "1": number
    /**
    Whether the key event was generated while holding the key (true), rather than pressing it the first time (false).
    */
    "2": boolean
}
/**
    Fired whenever a key is released (or the terminal is closed while a key was being pressed).
    
    [Documentation](https://tweaked.cc/event/key_up.html)
*/
interface key_up {
    /**
    The event name.
    */
    "0": "key_up"
    /**
    The numerical key value of the key pressed.
    */
    "1": number
}
/**
    The modem_message event is fired when a message is received on an open channel on any modem.
    
    [Documentation](https://tweaked.cc/event/modem_message.html)
*/
interface modem_message {
    /**
    The event name.
    */
    "0": "modem_message"
    /**
    The side of the modem that received the message.
    */
    "1": string
    /**
    The channel that the message was sent on.
    */
    "2": number
    /**
    The reply channel set by the sender.
    */
    "3": number
    /**
    The message as sent by the sender.
    */
    "4": any
    /**
    The distance between the sender and the receiver in blocks, or nil if the message was sent between dimensions.
    */
    "5": number | null
}
/**
    The monitor_resize event is fired when an adjacent or networked monitor's size is changed.
    
    [Documentation](https://tweaked.cc/event/monitor_resize.html)
*/
interface monitor_resize {
    /**
    The event name.
    */
    "0": "monitor_resize"
    /**
    The side or network ID of the monitor that was resized.
    */
    "1": string
}
/**
    The monitor_touch event is fired when an adjacent or networked Advanced Monitor is right-clicked.
    
    [Documentation](https://tweaked.cc/event/monitor_touch.html)
*/
interface monitor_touch {
    /**
    The event name.
    */
    "0": "monitor_touch"
    /**
    The side or network ID of the monitor that was touched.
    */
    "1": string
    /**
    The X coordinate of the touch, in characters.
    */
    "2": number
    /**
    The Y coordinate of the touch, in characters.
    */
    "3": number
}
/**
    This event is fired when the terminal is clicked with a mouse. This event is only fired on advanced computers (including
    advanced turtles and pocket computers).
    
    [Documentation](https://tweaked.cc/event/mouse_click.html)
*/
interface mouse_click {
    /**
    The event name.
    */
    "0": "mouse_click"
    /**
    The mouse button that was clicked.
    */
    "1": number
    /**
    The X-coordinate of the click.
    */
    "2": number
    /**
    The Y-coordinate of the click.
    */
    "3": number
}
/**
    This event is fired every time the mouse is moved while a mouse button is being held.
    
    [Documentation](https://tweaked.cc/event/mouse_drag.html)
*/
interface mouse_drag {
    /**
    The event name.
    */
    "0": "mouse_drag"
    /**
    The mouse button that is being pressed.
    */
    "1": number
    /**
    The X-coordinate of the mouse.
    */
    "2": number
    /**
    The Y-coordinate of the mouse.
    */
    "3": number
}
/**
    This event is fired when a mouse wheel is scrolled in the terminal.
    
    [Documentation](https://tweaked.cc/event/mouse_scroll.html)
*/
interface mouse_scroll {
    /**
    The event name.
    */
    "0": "mouse_scroll"
    /**
    The direction of the scroll. (-1 = up, 1 = down)
    */
    "1": number
    /**
    The X-coordinate of the mouse when scrolling.
    */
    "2": number
    /**
    The Y-coordinate of the mouse when scrolling.
    */
    "3": number
}
/**
    This event is fired when a mouse button is released or a held mouse leaves the computer's terminal.
    
    [Documentation](https://tweaked.cc/event/mouse_up.html)
*/
interface mouse_up {
    /**
    The event name.
    */
    "0": "mouse_up"
    /**
    The mouse button that was released.
    */
    "1": number
    /**
    The X-coordinate of the mouse.
    */
    "2": number
    /**
    The Y-coordinate of the mouse.
    */
    "3": number
}
/**
    The paste event is fired when text is pasted into the computer through Ctrl-V (or ⌘V on Mac).
    
    [Documentation](https://tweaked.cc/event/paste.html)
*/
interface paste {
    /**
    The event name.
    */
    "0": "paste"
    /**
    The text that was pasted.
    */
    "1": string
}
/**
    The peripheral event is fired when a peripheral is attached on a side or to a modem.
    
    [Documentation](https://tweaked.cc/event/peripheral.html)
*/
interface peripheral {
    /**
    The event name.
    */
    "0": "peripheral"
    /**
    The side the peripheral was attached to.
    */
    "1": string
}
/**
    The peripheral_detach event is fired when a peripheral is detached from a side or from a modem.
    
    [Documentation](https://tweaked.cc/event/peripheral_detach.html)
*/
interface peripheral_detach {
    /**
    The event name.
    */
    "0": "peripheral_detach"
    /**
    The side the peripheral was detached from.
    */
    "1": string
}
/**
    The rednet_message event is fired when a message is sent over Rednet.
    
    [Documentation](https://tweaked.cc/event/rednet_message.html)
*/
interface rednet_message {
    /**
    The event name.
    */
    "0": "rednet_message"
    /**
    The ID of the sending computer.
    */
    "1": number
    /**
    The message sent.
    */
    "2": any
    /**
    The protocol of the message, if provided.
    */
    "3": string | null
}
/**
    The redstone event is fired whenever any redstone inputs on the computer change.
    
    [Documentation](https://tweaked.cc/event/redstone.html)
*/
interface redstone {
    /**
    The event name.
    */
    "0": "redstone"
}
/**
    This uses io.lines to read audio data in blocks of 16KiB from "example_song.dfpwm", and then attempts to play it
    using speaker.playAudio. If the speaker's buffer is full, it waits for an event and tries again.
    
    [Documentation](https://tweaked.cc/event/speaker_audio_empty.html)
*/
interface speaker_audio_empty {
    /**
    The event name.
    */
    "0": "speaker_audio_empty"
    /**
    The name of the speaker which is available to play more audio.
    */
    "1": string
}
/**
    The task_complete event is fired when an asynchronous task completes. This is usually handled inside the function call that queued the task; however, functions such as commands.execAsync return immediately so the user can wait for completion.
    
    [Documentation](https://tweaked.cc/event/task_complete.html)
*/
interface task_complete {
    /**
    The event name.
    */
    "0": "task_complete"
    /**
    The ID of the task that completed.
    */
    "1": number
    /**
    Whether the command succeeded.
    */
    "2": boolean
    /**
    If the command failed, an error message explaining the failure. (This is not present if the command succeeded.)
    */
    "3": string
    /**
    Any parameters returned from the command.
    */
    "4": any[]
}
/**
    The term_resize event is fired when the main terminal is resized. For instance:
    
    [Documentation](https://tweaked.cc/event/term_resize.html)
*/
interface term_resize {
    /**
    The event name.
    */
    "0": "term_resize"
}
/**
    The terminate event is fired when Ctrl-T is held down.
    
    [Documentation](https://tweaked.cc/event/terminate.html)
*/
interface terminate {
    /**
    The event name.
    */
    "0": "terminate"
}
/**
    The timer event is fired when a timer started with os.startTimer completes.
    
    [Documentation](https://tweaked.cc/event/timer.html)
*/
interface timer {
    /**
    The event name.
    */
    "0": "timer"
    /**
    The ID of the timer that finished.
    */
    "1": number
}
/**
    The turtle_inventory event is fired when a turtle's inventory is changed.
    
    [Documentation](https://tweaked.cc/event/turtle_inventory.html)
*/
interface turtle_inventory {
    /**
    The event name.
    */
    "0": "turtle_inventory"
}
/**
    The websocket_closed event is fired when an open WebSocket connection is closed.
    
    [Documentation](https://tweaked.cc/event/websocket_closed.html)
*/
interface websocket_closed {
    /**
    The event name.
    */
    "0": "websocket_closed"
    /**
    The URL of the WebSocket that was closed.
    */
    "1": string
    /**
    The server-provided reason
           the websocket was closed. This will be nil if the connection was closed
           abnormally.
    */
    "2": string | null
    /**
    The connection close code,
           indicating why the socket was closed. This will be nil if the connection
           was closed abnormally.
    */
    "3": number | null
}
/**
    The websocket_failure event is fired when a WebSocket connection request fails.
    
    [Documentation](https://tweaked.cc/event/websocket_failure.html)
*/
interface websocket_failure {
    /**
    The event name.
    */
    "0": "websocket_failure"
    /**
    The URL of the site requested.
    */
    "1": string
    /**
    An error describing the failure.
    */
    "2": string
}
/**
    The websocket_message event is fired when a message is received on an open WebSocket connection.
    
    [Documentation](https://tweaked.cc/event/websocket_message.html)
*/
interface websocket_message {
    /**
    The event name.
    */
    "0": "websocket_message"
    /**
    The URL of the WebSocket.
    */
    "1": string
    /**
    The contents of the message.
    */
    "2": string
    /**
    Whether this is a binary message.
    */
    "3": boolean
}
/**
    The websocket_success event is fired when a WebSocket connection request returns successfully.
    
    [Documentation](https://tweaked.cc/event/websocket_success.html)
*/
interface websocket_success {
    /**
    The event name.
    */
    "0": "websocket_success"
    /**
    The URL of the site.
    */
    "1": string
    /**
    The handle for the WebSocket.
    */
    "2": http.Websocket
}
interface EventMap {
    "alarm": alarm
    "char": char
    "computer_command": computer_command
    "disk": disk
    "disk_eject": disk_eject
    "file_transfer": file_transfer
    "http_check": http_check
    "http_failure": http_failure
    "http_success": http_success
    "key": key
    "key_up": key_up
    "modem_message": modem_message
    "monitor_resize": monitor_resize
    "monitor_touch": monitor_touch
    "mouse_click": mouse_click
    "mouse_drag": mouse_drag
    "mouse_scroll": mouse_scroll
    "mouse_up": mouse_up
    "paste": paste
    "peripheral": peripheral
    "peripheral_detach": peripheral_detach
    "rednet_message": rednet_message
    "redstone": redstone
    "speaker_audio_empty": speaker_audio_empty
    "task_complete": task_complete
    "term_resize": term_resize
    "terminate": terminate
    "timer": timer
    "turtle_inventory": turtle_inventory
    "websocket_closed": websocket_closed
    "websocket_failure": websocket_failure
    "websocket_message": websocket_message
    "websocket_success": websocket_success
}
interface PeripheralMap {
    "command": command
    "computer": computer
    "drive": drive
    "modem": modem
    "monitor": monitor
    "printer": printer
    "speaker": speaker
    "energy_storage": energy_storage
    "fluid_storage": fluid_storage
    "inventory": inventory
}
