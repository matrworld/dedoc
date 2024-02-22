import chalk from 'chalk';

export function formatFinalSummary(results) {
    const { collectionMint, projectConfigUri, projectConfig, merkleTree, assetId, update } = results;
  
    return `
    ${chalk.blue('Final Summary:')}
  
    ${chalk.green('Collection Creation:')}
    - Status: ${collectionMint ? 'Success' : 'Failed'}
    - Collection Mint ID: ${collectionMint ? collectionMint.publicKey.toString() : 'N/A'}
  
    ${chalk.green('Project Configuration JSON:')}
    - Status: ${projectConfigUri ? 'Success' : 'Failed'}
    - Config URI: ${projectConfigUri || 'N/A'}
  
    ${chalk.green('Project Configuration Upload:')}
    - Status: ${projectConfig ? 'Success' : 'Failed'}
    - Uploaded URI: ${projectConfig || 'N/A'}
  
    ${chalk.green('Merkle Tree Creation:')}
    - Status: ${merkleTree ? 'Success' : 'Failed'}
    - Merkle Tree ID: ${merkleTree ? merkleTree.publicKey.toString() : 'N/A'}
  
    ${chalk.green('Project Configuration Minting:')}
    - Status: ${assetId ? 'Success' : 'Failed'}
    - Asset ID: ${assetId || 'N/A'}
  
    ${chalk.green('Project Configuration Update:')}
    - Status: ${update ? 'Success' : 'Failed'}
    `;
  }