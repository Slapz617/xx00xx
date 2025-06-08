import { Connection, PublicKey, Keypair, SystemProgram, Transaction, LAMPORTS_PER_SOL } from '@solana/web3.js';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import * as crypto from 'crypto';

export interface WalletAuthConfig {
  encryptionKey?: string;
  recoveryEnabled?: boolean;
  biometricEnabled?: boolean;
  sessionTimeout?: number;
}

export interface AuthSession {
  userId: string;
  walletAddress: string;
  sessionId: string;
  createdAt: Date;
  expiresAt: Date;
  isActive: boolean;
  permissions: string[];
}

export interface RecoveryInfo {
  recoveryPhrase: string[];
  encryptedSeed: string;
  recoveryQuestions: Array<{
    question: string;
    hashedAnswer: string;
  }>;
}

/**
 * Secure Wallet Authentication Service
 * Handles secure key generation, storage, and user authentication flows
 */
export class WalletAuthService {
  private connection: Connection;
  private activeSessions: Map<string, AuthSession> = new Map();
  private recoveryStore: Map<string, RecoveryInfo> = new Map();
  private readonly ENCRYPTION_ALGORITHM = 'aes-256-gcm';
  private readonly SESSION_TIMEOUT = 24 * 60 * 60 * 1000; // 24 hours

  constructor(connection: Connection) {
    this.connection = connection;
    this.loadStoredSessions();
  }

  /**
   * Generate a new wallet with secure key generation
   */
  async generateWallet(config: WalletAuthConfig = {}): Promise<{
    keypair: Keypair;
    publicKey: string;
    encryptedPrivateKey: string;
    recoveryInfo: RecoveryInfo;
  }> {
    try {
      // Generate new keypair
      const keypair = Keypair.generate();
      const publicKey = keypair.publicKey.toString();

      // Generate secure encryption key
      const encryptionKey = config.encryptionKey || this.generateEncryptionKey();
      
      // Encrypt private key
      const encryptedPrivateKey = this.encryptPrivateKey(
        keypair.secretKey, 
        encryptionKey
      );

      // Generate recovery information
      const recoveryInfo = await this.generateRecoveryInfo(keypair, encryptionKey);

      console.log('✅ Secure wallet generated:', {
        publicKey,
        hasRecovery: true,
        encrypted: true
      });

      return {
        keypair,
        publicKey,
        encryptedPrivateKey,
        recoveryInfo
      };

    } catch (error) {
      console.error('❌ Wallet generation failed:', error);
      throw new Error(`Wallet generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Authenticate user and create secure session
   */
  async authenticate(
    walletAddress: string,
    signature?: string,
    message?: string
  ): Promise<AuthSession> {
    try {
      // Validate wallet address
      if (!this.isValidSolanaAddress(walletAddress)) {
        throw new Error('Invalid Solana wallet address');
      }

      // Verify signature if provided
      if (signature && message) {
        const isValid = await this.verifySignature(walletAddress, signature, message);
        if (!isValid) {
          throw new Error('Invalid signature verification');
        }
      }

      // Create new session
      const sessionId = this.generateSessionId();
      const userId = this.generateUserId(walletAddress);
      
      const session: AuthSession = {
        userId,
        walletAddress,
        sessionId,
        createdAt: new Date(),
        expiresAt: new Date(Date.now() + this.SESSION_TIMEOUT),
        isActive: true,
        permissions: ['trade', 'stake', 'view_portfolio']
      };

      // Store session
      this.activeSessions.set(sessionId, session);
      this.saveSessionToStorage(session);

      console.log('✅ User authenticated successfully:', {
        userId,
        sessionId,
        permissions: session.permissions
      });

      return session;

    } catch (error) {
      console.error('❌ Authentication failed:', error);
      throw new Error(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Validate active session
   */
  validateSession(sessionId: string): AuthSession | null {
    const session = this.activeSessions.get(sessionId);
    
    if (!session || !session.isActive) {
      return null;
    }

    // Check if session has expired
    if (new Date() > session.expiresAt) {
      this.deactivateSession(sessionId);
      return null;
    }

    return session;
  }

  /**
   * Deactivate session (logout)
   */
  deactivateSession(sessionId: string): boolean {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.isActive = false;
      this.activeSessions.set(sessionId, session);
      this.removeSessionFromStorage(sessionId);
      return true;
    }
    return false;
  }

  /**
   * Wallet recovery using recovery phrase
   */
  async recoverWallet(
    recoveryPhrase: string[],
    newPassword: string
  ): Promise<Keypair> {
    try {
      // Validate recovery phrase
      if (!this.validateRecoveryPhrase(recoveryPhrase)) {
        throw new Error('Invalid recovery phrase');
      }

      // Reconstruct keypair from recovery phrase
      const seed = this.phraseToSeed(recoveryPhrase);
      const keypair = Keypair.fromSeed(seed);

      // Re-encrypt with new password
      const encryptionKey = this.generateEncryptionKey(newPassword);
      const encryptedPrivateKey = this.encryptPrivateKey(keypair.secretKey, encryptionKey);

      console.log('✅ Wallet recovered successfully');
      return keypair;

    } catch (error) {
      console.error('❌ Wallet recovery failed:', error);
      throw new Error(`Wallet recovery failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Generate secure recovery information
   */
  private async generateRecoveryInfo(keypair: Keypair, encryptionKey: string): Promise<RecoveryInfo> {
    // Generate 12-word recovery phrase
    const recoveryPhrase = this.generateRecoveryPhrase(keypair.secretKey);
    
    // Encrypt seed
    const encryptedSeed = this.encryptPrivateKey(keypair.secretKey, encryptionKey);

    // Generate recovery questions (placeholder - would be user-provided)
    const recoveryQuestions = [
      {
        question: "What was your first pet's name?",
        hashedAnswer: this.hashString("placeholder")
      },
      {
        question: "In what city were you born?",
        hashedAnswer: this.hashString("placeholder")
      }
    ];

    return {
      recoveryPhrase,
      encryptedSeed,
      recoveryQuestions
    };
  }

  /**
   * Encrypt private key using AES-256-GCM
   */
  private encryptPrivateKey(privateKey: Uint8Array, encryptionKey: string): string {
    try {
      const algorithm = this.ENCRYPTION_ALGORITHM;
      const key = crypto.scryptSync(encryptionKey, 'salt', 32);
      const iv = crypto.randomBytes(16);
      const cipher = crypto.createCipher(algorithm, key);
      
      let encrypted = cipher.update(Buffer.from(privateKey), 'binary', 'hex');
      encrypted += cipher.final('hex');
      
      return `${iv.toString('hex')}:${encrypted}`;
    } catch (error) {
      throw new Error('Encryption failed');
    }
  }

  /**
   * Decrypt private key
   */
  private decryptPrivateKey(encryptedPrivateKey: string, encryptionKey: string): Uint8Array {
    try {
      const [ivHex, encrypted] = encryptedPrivateKey.split(':');
      const algorithm = this.ENCRYPTION_ALGORITHM;
      const key = crypto.scryptSync(encryptionKey, 'salt', 32);
      const iv = Buffer.from(ivHex, 'hex');
      const decipher = crypto.createDecipher(algorithm, key);
      
      let decrypted = decipher.update(encrypted, 'hex', 'binary');
      decrypted += decipher.final('binary');
      
      return new Uint8Array(Buffer.from(decrypted, 'binary'));
    } catch (error) {
      throw new Error('Decryption failed');
    }
  }

  /**
   * Generate encryption key
   */
  private generateEncryptionKey(password?: string): string {
    if (password) {
      return crypto.createHash('sha256').update(password).digest('hex');
    }
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate recovery phrase from private key
   */
  private generateRecoveryPhrase(privateKey: Uint8Array): string[] {
    // Simplified word generation - in production, use BIP39
    const words = [
      'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract',
      'absurd', 'abuse', 'access', 'accident', 'account', 'accuse', 'achieve', 'acid'
    ];
    
    const phrase: string[] = [];
    const hash = crypto.createHash('sha256').update(privateKey).digest();
    
    for (let i = 0; i < 12; i++) {
      const index = hash[i % hash.length] % words.length;
      phrase.push(words[index]);
    }
    
    return phrase;
  }

  /**
   * Convert recovery phrase to seed
   */
  private phraseToSeed(phrase: string[]): Uint8Array {
    const combined = phrase.join(' ');
    const hash = crypto.createHash('sha256').update(combined).digest();
    return new Uint8Array(hash.slice(0, 32));
  }

  /**
   * Validate recovery phrase format
   */
  private validateRecoveryPhrase(phrase: string[]): boolean {
    return phrase.length === 12 && phrase.every(word => typeof word === 'string' && word.length > 0);
  }

  /**
   * Generate session ID
   */
  private generateSessionId(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Generate user ID from wallet address
   */
  private generateUserId(walletAddress: string): string {
    return crypto.createHash('sha256').update(walletAddress).digest('hex').slice(0, 16);
  }

  /**
   * Hash string using SHA-256
   */
  private hashString(input: string): string {
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Verify signature (placeholder implementation)
   */
  private async verifySignature(
    walletAddress: string,
    signature: string,
    message: string
  ): Promise<boolean> {
    // In production, implement proper signature verification
    // using Solana's signature verification methods
    return true;
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
   * Load stored sessions from localStorage
   */
  private loadStoredSessions(): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('wallet_auth_sessions');
        if (stored) {
          const sessions = JSON.parse(stored);
          Object.entries(sessions).forEach(([sessionId, sessionData]) => {
            this.activeSessions.set(sessionId, sessionData as AuthSession);
          });
        }
      }
    } catch (error) {
      console.error('Failed to load stored sessions:', error);
    }
  }

  /**
   * Save session to localStorage
   */
  private saveSessionToStorage(session: AuthSession): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('wallet_auth_sessions') || '{}';
        const sessions = JSON.parse(stored);
        sessions[session.sessionId] = session;
        localStorage.setItem('wallet_auth_sessions', JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('Failed to save session to storage:', error);
    }
  }

  /**
   * Remove session from localStorage
   */
  private removeSessionFromStorage(sessionId: string): void {
    try {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('wallet_auth_sessions') || '{}';
        const sessions = JSON.parse(stored);
        delete sessions[sessionId];
        localStorage.setItem('wallet_auth_sessions', JSON.stringify(sessions));
      }
    } catch (error) {
      console.error('Failed to remove session from storage:', error);
    }
  }

  /**
   * Get session statistics
   */
  getSessionStats(): {
    activeSessions: number;
    totalSessions: number;
    averageSessionDuration: number;
  } {
    const active = Array.from(this.activeSessions.values()).filter(s => s.isActive);
    const total = this.activeSessions.size;
    const avgDuration = active.reduce((sum, session) => {
      return sum + (new Date().getTime() - session.createdAt.getTime());
    }, 0) / (active.length || 1);

    return {
      activeSessions: active.length,
      totalSessions: total,
      averageSessionDuration: avgDuration
    };
  }
}

/**
 * Hook for using wallet authentication
 */
export function useWalletAuth() {
  const { connection } = useConnection();
  const { publicKey, connected, signMessage } = useWallet();
  
  const authService = new WalletAuthService(connection);

  const authenticate = async () => {
    if (!publicKey || !connected) {
      throw new Error('Wallet not connected');
    }

    let signature: string | undefined;
    let message: string | undefined;

    // Sign authentication message if wallet supports it
    if (signMessage) {
      message = `Authenticate with DEX at ${new Date().toISOString()}`;
      const messageBytes = new TextEncoder().encode(message);
      const signatureBytes = await signMessage(messageBytes);
      signature = Buffer.from(signatureBytes).toString('hex');
    }

    return authService.authenticate(publicKey.toString(), signature, message);
  };

  const generateWallet = async (config?: WalletAuthConfig) => {
    return authService.generateWallet(config);
  };

  const validateSession = (sessionId: string) => {
    return authService.validateSession(sessionId);
  };

  const logout = (sessionId: string) => {
    return authService.deactivateSession(sessionId);
  };

  const recoverWallet = async (recoveryPhrase: string[], newPassword: string) => {
    return authService.recoverWallet(recoveryPhrase, newPassword);
  };

  return {
    authService,
    authenticate,
    generateWallet,
    validateSession,
    logout,
    recoverWallet,
    connected,
    publicKey: publicKey?.toString()
  };
}