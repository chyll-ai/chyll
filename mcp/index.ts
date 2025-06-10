import { commands as supabaseCommands } from './supabase';

const commandSets = {
  supabase: supabaseCommands
};

type CommandSet = keyof typeof commandSets;

async function runCommand(set: CommandSet, command: string, args: any[] = []) {
  try {
    if (!(set in commandSets)) {
      throw new Error(`Unknown command set: ${set}`);
    }

    const commandSet = commandSets[set];
    if (!(command in commandSet)) {
      throw new Error(`Unknown command: ${command} in set ${set}`);
    }

    // @ts-ignore - We've already checked the command exists
    const result = await commandSet[command](...args);
    return { success: true, data: result };
  } catch (error) {
    console.error(`Error running command ${set}.${command}:`, error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

// Example usage:
async function main() {
  const args = process.argv.slice(2);
  if (args.length < 2) {
    console.log('Usage: ts-node mcp/index.ts <command-set> <command> [args...]');
    console.log('\nAvailable command sets:');
    Object.keys(commandSets).forEach(set => {
      console.log(`\n${set}:`);
      // @ts-ignore - We know these are objects with functions
      Object.keys(commandSets[set]).forEach(cmd => {
        console.log(`  ${cmd}`);
      });
    });
    process.exit(1);
  }

  const [set, command, ...commandArgs] = args;
  const result = await runCommand(set as CommandSet, command, commandArgs);
  console.log(JSON.stringify(result, null, 2));
}

if (require.main === module) {
  main().catch(console.error);
}

export { runCommand, commandSets }; 