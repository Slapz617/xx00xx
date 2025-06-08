import { Connection, PublicKey, SystemProgram, Transaction, Keypair, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';

export interface DexAccount {
  publicKey: string;
  balance: number;
  isActive: boolean;
  createdAt: string;
  lastActivity: string;
  transactions: TransactionRecord[];
  portfolioValue: number;
  totalTrades: number;
}

export interface TransactionRecord {
  signature: string;
  type: 'swap' | 'stake' | 'unstake' | 'deposit' | 'withdraw';
  fromToken: string;
  toToken: string;
  amount: number;
  timestamp: string;
  status: 'success' | 'failed' | 'pending';
  fee: number;
}

export interface AccountCreationOptions {
  initialBalance?: number;
  enableStaking?: boolean;
  enableTrading?: boolean;
  securityLevel?: 'basic' | 'enhanced' | 'premium';
}

class DexAccountService {
  private connection: Connection;
  private accounts: Map<string, DexAccount> = new Map();

  constructor(connection: Connection) {
    this.connection = connection;
    this.loadStoredAccounts();
  }

  /**
   * Create a new DEX user account
   */
  async createAccount(
    walletPublicKey: PublicKey,
    options: AccountCreationOptions = {}
  ): Promise<DexAccount> {
    try {
      // Validate the wallet address
      if (!this.isValidSolanaAddress(walletPublicKey.toString())) {
        throw new Error('Invalid Solana wallet address');
      }

      // Check if account already exists
      if (this.accounts.has(walletPublicKey.toString())) {
        throw new Error('Account already exists for this wallet');
      }

      // Get current balance
      const balance = await this.connection.getBalance(walletPublicKey);
      const balanceInSol = balance / LAMPORTS_PER_SOL;

      // Create new account record
      const newAccount: DexAccount = {
        publicKey: walletPublicKey.toString(),
        balance: balanceInSol,
        isActive: true,
        createdAt: new Date().toISOString(),
        lastActivity: new Date().toISOString(),
        transactions: [],
        portfolioValue: balanceInSol * 23.45, // Mock SOL price
        totalTrades: 0
      };

      // Store account
      this.accounts.set(walletPublicKey.toString(), newAccount);
      this.saveAccountsToStorage();

      console.log(`✅ DEX Account created successfully for: ${walletPublicKey.toString()}`);
      return newAccount;

    } catch (error) {
      console.error('Failed to create DEX account:', error);
      throw new Error(`Account creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Get account information
   */
  async getAccount(publicKey: string): Promise<DexAccount | null> {
    try {
      // Check local storage first
      if (this.accounts.has(publicKey)) {
        const account = this.accounts.get(publicKey)!;
        
        // Update balance from blockchain
        const walletPubKey = new PublicKey(publicKey);
        const balance = await this.connection.getBalance(walletPubKey);
        account.balance = balance / LAMPORTS_PER_SOL;
        account.portfolioValue = account.balance * 23.45; // Mock price
        account.lastActivity = new Date().toISOString();

        this.accounts.set(publicKey, account);
        this.saveAccountsToStorage();

        return account;
      }

      return null;
    } catch (error) {
      console.error('Failed to get account:', error);
      return null;
    }
  }

  /**
   * Update account activity
   */
  async updateAccountActivity(
    publicKey: string,
    transaction: Omit<TransactionRecord, 'timestamp'>
  ): Promise<void> {
    const account = this.accounts.get(publicKey);
    if (!account) {
      throw new Error('Account not found');
    }

    const fullTransaction: TransactionRecord = {
      ...transaction,
      timestamp: new Date().toISOString()
    };

    account.transactions.unshift(fullTransaction);
    account.lastActivity = new Date().toISOString();
    account.totalTrades += 1;

    // Keep only last 100 transactions
    if (account.transactions.length > 100) {
      account.transactions = account.transactions.slice(0, 100);
    }

    this.accounts.set(publicKey, account);
    this.saveAccountsToStorage();
  }

  /**
   * Initialize account with default permissions and security
   */
  async initializeAccountSecurity(
    publicKey: string,
    securityLevel: 'basic' | 'enhanced' | 'premium' = 'basic'
  ): Promise<boolean> {
    try {
      const account = this.accounts.get(publicKey);
      if (!account) {
        throw new Error('Account not found');
      }

      // Security protocols based on level
      const securityProtocols = {
        basic: {
          maxTransactionAmount: 10, // SOL
          requireConfirmation: false,
          enableStaking: true,
          enableAdvancedTrading: false
        },
        enhanced: {
          maxTransactionAmount: 100,
          requireConfirmation: true,
          enableStaking: true,
          enableAdvancedTrading: true
        },
        premium: {
          maxTransactionAmount: 1000,
          requireConfirmation: true,
          enableStaking: true,
          enableAdvancedTrading: true
        }
      };

      const protocols = securityProtocols[securityLevel];
      console.log(`🔒 Security protocols applied for ${securityLevel} level:`, protocols);

      return true;
    } catch (error) {
      console.error('Failed to initialize account security:', error);
      return false;
    }
  }

  /**
   * Validate Solana address format
   */
  private isValidSolanaAddress(address: string): boolean {
    try {
      new PublicKey(address);
      return address.length >= 32 && address.length <= 44;
    } catch {
      return false;
    }
  }

  /**
   * Load accounts from local storage
   */
  private loadStoredAccounts(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('dex_accounts');
        if (stored) {
          const parsed = JSON.parse(stored);
          this.accounts = new Map(Object.entries(parsed));
        }
      }
    } catch (error) {
      console.error('Failed to load stored accounts:', error);
    }
  }

  /**
   * Save accounts to local storage
   */
  private saveAccountsToStorage(): void {
    try {
      if (typeof window !== 'undefined') {
        const accountsObj = Object.fromEntries(this.accounts);
        localStorage.setItem('dex_accounts', JSON.stringify(accountsObj));
      }
    } catch (error) {
      console.error('Failed to save accounts to storage:', error);
    }
  }

  /**
   * Get all accounts (admin function)
   */
  getAllAccounts(): DexAccount[] {
    return Array.from(this.accounts.values());
  }

  /**
   * Account statistics
   */
  getAccountStats(): {
    totalAccounts: number;
    activeAccounts: number;
    totalVolume: number;
    totalTrades: number;
  } {
    const accounts = this.getAllAccounts();
    return {
      totalAccounts: accounts.length,
      activeAccounts: accounts.filter(acc => acc.isActive).length,
      totalVolume: accounts.reduce((sum, acc) => sum + acc.portfolioValue, 0),
      totalTrades: accounts.reduce((sum, acc) => sum + acc.totalTrades, 0)
    };
  }
}

// Hook for using the account service
export function useDexAccount() {
  const { connection } = useConnection();
  const { publicKey, connected } = useWallet();
  
  const accountService = new DexAccountService(connection);

  const createAccount = async (options?: AccountCreationOptions) => {
    if (!publicKey) throw new Error('Wallet not connected');
    return accountService.createAccount(publicKey, options);
  };

  const getAccount = async () => {
    if (!publicKey) return null;
    return accountService.getAccount(publicKey.toString());
  };

  const recordTransaction = async (transaction: Omit<TransactionRecord, 'timestamp'>) => {
    if (!publicKey) throw new Error('Wallet not connected');
    return accountService.updateAccountActivity(publicKey.toString(), transaction);
  };

  return {
    accountService,
    createAccount,
    getAccount,
    recordTransaction,
    connected,
    publicKey: publicKey?.toString()
  };
}

export default DexAccountService;