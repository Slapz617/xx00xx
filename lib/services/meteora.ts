// Enhanced Meteora API service for vault and analytics data
export interface MeteoraAnalytics {
  total_fee_vaults: number;
  total_staked_amount_usd: number;
}

export interface VaultInfo {
  vault: string;
  pool: string;
  token_mint: string;
  lp_mint: string;
  base_mint: string;
  quote_mint: string;
  total_staked_amount: string;
  total_staked_amount_usd: number;
  total_reward_amount_usd: number;
  apr: number;
  created_at: string;
  tx_signature: string;
  is_active: boolean;
  vault_name: string;
  pool_name: string;
  base_token_symbol: string;
  quote_token_symbol: string;
  base_token_decimals: number;
  quote_token_decimals: number;
  total_fees_24h_usd: number;
  stakers_count: number;
}

export interface AllVaultsResponse {
  total_vaults: number;
  vaults: VaultInfo[];
}

export interface SingleVaultResponse extends VaultInfo {
  detailed_rewards: {
    daily_rewards_usd: number;
    weekly_rewards_usd: number;
    monthly_rewards_usd: number;
  };
  staking_history: {
    timestamp: string;
    action: 'stake' | 'unstake';
    amount: string;
    amount_usd: number;
    user: string;
  }[];
}

class MeteoraApiService {
  private baseURL = 'https://devnet.stake-for-fee-api.meteora.ag';
  private retryCount = 3;
  private retryDelay = 1000;

  private async makeRequest<T>(endpoint: string, retries = this.retryCount): Promise<T> {
    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        method: 'GET',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error(`Meteora API request failed for ${endpoint}:`, error);
      
      if (retries > 0) {
        console.log(`Retrying request to ${endpoint} in ${this.retryDelay}ms... (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay));
        return this.makeRequest<T>(endpoint, retries - 1);
      }
      
      throw error;
    }
  }

  // Get all analytics data
  async getAnalytics(): Promise<MeteoraAnalytics> {
    try {
      return await this.makeRequest<MeteoraAnalytics>('/analytics/all');
    } catch (error) {
      console.error('Failed to fetch Meteora analytics:', error);
      // Return default values based on your actual API response
      return {
        total_fee_vaults: 4,
        total_staked_amount_usd: 0
      };
    }
  }

  // Get all vaults information
  async getAllVaults(): Promise<AllVaultsResponse> {
    try {
      return await this.makeRequest<AllVaultsResponse>('/vault/all');
    } catch (error) {
      console.error('Failed to fetch all vaults:', error);
      return {
        total_vaults: 0,
        vaults: []
      };
    }
  }

  // Get specific vault information
  async getVault(vaultAddress: string): Promise<SingleVaultResponse> {
    return this.makeRequest<SingleVaultResponse>(`/vault/${vaultAddress}`);
  }

  // Helper method to get formatted vault data with error handling
  async getVaultsWithFormatting(): Promise<VaultInfo[]> {
    try {
      const response = await this.getAllVaults();
      
      if (response.vaults && response.vaults.length > 0) {
        console.log(`Successfully fetched ${response.vaults.length} vaults from Meteora API`);
        return response.vaults;
      } else {
        console.log('No vaults returned from API, using mock data');
        return this.getMockVaults();
      }
    } catch (error) {
      console.error('Error fetching vaults, falling back to mock data:', error);
      return this.getMockVaults();
    }
  }

  // Enhanced mock data based on your actual API structure
  private getMockVaults(): VaultInfo[] {
    return [
      {
        vault: '7pGBqB5mD4pEj9bpqfTdXbJbSrEqGMz3PvEKCaQxnG5q',
        pool: '2pCXP5h3JQZC7xGBqB5mD4pEj9bpqfTdXbJbSrEqGMz',
        token_mint: 'So11111111111111111111111111111111111111112',
        lp_mint: 'LPMINTabc123def456789abc123def456789abc123',
        base_mint: 'So11111111111111111111111111111111111111112',
        quote_mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        total_staked_amount: '1000.523456789',
        total_staked_amount_usd: 23845.67,
        total_reward_amount_usd: 1256.89,
        apr: 45.8,
        created_at: '2024-01-15T10:30:00Z',
        tx_signature: '5KJTGnJBV2xW8p6pGBqB5mD4pEj9bpqfTdXbJbSrEqGMz3PvEKCaQxnG5q8B3zR',
        is_active: true,
        vault_name: 'SOL-USDC High Yield Vault',
        pool_name: 'SOL/USDC Liquidity Pool',
        base_token_symbol: 'SOL',
        quote_token_symbol: 'USDC',
        base_token_decimals: 9,
        quote_token_decimals: 6,
        total_fees_24h_usd: 234.56,
        stakers_count: 157
      },
      {
        vault: '8qHcBqB5mD4pEj9bpqfTdXbJbSrEqGMz3PvEKCaQxnG6r',
        pool: '3qDYQ6h3JQZC7xGBqB5mD4pEj9bpqfTdXbJbSrEqGMz',
        token_mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        lp_mint: 'LPMINTdef456789abc123def456789abc123def456',
        base_mint: 'DezXAZ8z7PnrnRJjz3wXBoRgixCa6xjnB7YaB1pPB263',
        quote_mint: 'So11111111111111111111111111111111111111112',
        total_staked_amount: '2500000.987654321',
        total_staked_amount_usd: 4567.23,
        total_reward_amount_usd: 789.45,
        apr: 32.4,
        created_at: '2024-01-20T14:15:00Z',
        tx_signature: '6LKUHoKCV3yX9q7qHCrC6nE5qK0cqrUeYcJbSrEqGMz3PvEKCaQxnG5q9C4aS',
        is_active: true,
        vault_name: 'BONK-SOL Meme Vault',
        pool_name: 'BONK/SOL Liquidity Pool',
        base_token_symbol: 'BONK',
        quote_token_symbol: 'SOL',
        base_token_decimals: 5,
        quote_token_decimals: 9,
        total_fees_24h_usd: 156.78,
        stakers_count: 89
      },
      {
        vault: '9rIdCrC6nE5qK0cqrUeYcJbSrEqGMz3PvEKCaQxnG7s',
        pool: '4rEZR7h3JQZC7xGBqB5mD4pEj9bpqfTdXbJbSrEqGMz',
        token_mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
        lp_mint: 'LPMINTghi789abc123def456789abc123def456789',
        base_mint: '4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU',
        quote_mint: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
        total_staked_amount: '750.123456789',
        total_staked_amount_usd: 8234.12,
        total_reward_amount_usd: 445.67,
        apr: 28.9,
        created_at: '2024-02-01T09:45:00Z',
        tx_signature: '7MLVIpLDW4zY0r8rIDsD7oF6rL1dsUtFzDKcSsGrHNz3PvEKCaQxnG5q0D5bT',
        is_active: false,
        vault_name: 'USDC-USDT Stable Vault',
        pool_name: 'USDC/USDT Stable Pool',
        base_token_symbol: 'USDC',
        quote_token_symbol: 'USDT',
        base_token_decimals: 6,
        quote_token_decimals: 6,
        total_fees_24h_usd: 89.34,
        stakers_count: 234
      },
      {
        vault: 'ArKFGpNQx8s9Fj2K5LmvwzgAHBjHjdsdsjfksjdkfjksdf',
        pool: '5sGHJ8h3JQZC7xGBqB5mD4pEj9bpqfTdXbJbSrEqGMz',
        token_mint: 'mSoLzYCxHdYgdziU2hcs1Mo6u8vb8gwKo6xDK4YZkKkZ',
        lp_mint: 'LPMINTjkl012abc123def456789abc123def456789',
        base_mint: 'mSoLzYCxHdYgdziU2hcs1Mo6u8vb8gwKo6xDK4YZkKkZ',
        quote_mint: 'So11111111111111111111111111111111111111112',
        total_staked_amount: '1250.987654321',
        total_staked_amount_usd: 12456.78,
        total_reward_amount_usd: 678.90,
        apr: 38.7,
        created_at: '2024-02-10T16:20:00Z',
        tx_signature: '8NMWJqMEX5zA1s9sJEtE8pG7sM2etVuGAELdTtHsINz3PvEKCaQxnG5q1E6cU',
        is_active: true,
        vault_name: 'mSOL-SOL Liquid Staking Vault',
        pool_name: 'mSOL/SOL Liquid Staking Pool',
        base_token_symbol: 'mSOL',
        quote_token_symbol: 'SOL',
        base_token_decimals: 9,
        quote_token_decimals: 9,
        total_fees_24h_usd: 345.67,
        stakers_count: 123
      }
    ];
  }

  // Health check method
  async healthCheck(): Promise<boolean> {
    try {
      await this.makeRequest<MeteoraAnalytics>('/analytics/all');
      return true;
    } catch {
      return false;
    }
  }

  // Get real-time vault updates
  async getVaultUpdates(vaultAddresses: string[]): Promise<VaultInfo[]> {
    const updates = await Promise.allSettled(
      vaultAddresses.map(address => this.getVault(address))
    );
    
    return updates
      .filter((result): result is PromiseFulfilledResult<SingleVaultResponse> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value);
  }
}

export const meteoraApiService = new MeteoraApiService();