'use client';

import React, { useState, useEffect } from 'react';
import { useWallet, useConnection } from '@solana/wallet-adapter-react';
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { 
  User, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  Settings, 
  Activity,
  Wallet,
  TrendingUp,
  Clock,
  DollarSign
} from 'lucide-react';
import { useDexAccount, type DexAccount } from '@/lib/services/accounts';

export function AccountManager() {
  const { connected, publicKey } = useWallet();
  const [account, setAccount] = useState<DexAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [securityLevel, setSecurityLevel] = useState<'basic' | 'enhanced' | 'premium'>('basic');
  
  const { accountService, createAccount, getAccount, recordTransaction } = useDexAccount();

  useEffect(() => {
    if (connected && publicKey) {
      loadAccount();
    } else {
      setAccount(null);
    }
  }, [connected, publicKey]);

  const loadAccount = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const existingAccount = await getAccount();
      setAccount(existingAccount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load account');
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = async () => {
    if (!publicKey) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const newAccount = await createAccount({
        enableStaking: true,
        enableTrading: true,
        securityLevel
      });
      
      // Initialize security protocols
      await accountService.initializeAccountSecurity(publicKey.toString(), securityLevel);
      
      setAccount(newAccount);
      console.log('✅ Account created and initialized:', newAccount);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setLoading(false);
    }
  };

  const handleTestTransaction = async () => {
    if (!account) return;
    
    try {
      await recordTransaction({
        signature: `test_${Date.now()}`,
        type: 'swap',
        fromToken: 'SOL',
        toToken: 'USDC',
        amount: 1.0,
        status: 'success',
        fee: 0.00025
      });
      
      // Reload account to show updated transaction
      await loadAccount();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to record transaction');
    }
  };

  if (!connected) {
    return (
      <div className="glass-morphism p-8 text-center">
        <Wallet className="h-16 w-16 text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-4">Connect Your Wallet</h2>
        <p className="text-gray-400 mb-6">
          Connect your Solana wallet to create or access your DEX account
        </p>
        <WalletMultiButton className="!bg-gradient-to-r !from-purple-600 !to-blue-600 hover:!from-purple-700 hover:!to-blue-700 !rounded-lg" />
      </div>
    );
  }

  if (loading) {
    return (
      <div className="glass-morphism p-8 text-center">
        <div className="animate-spin h-8 w-8 border-2 border-purple-400 border-t-transparent rounded-full mx-auto mb-4"></div>
        <p className="text-white">Loading account...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="glass-morphism p-8">
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-400" />
          <h2 className="text-xl font-bold text-white">Error</h2>
        </div>
        <p className="text-red-300 mb-4">{error}</p>
        <button
          onClick={loadAccount}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!account) {
    return (
      <div className="glass-morphism p-8">
        <div className="text-center mb-6">
          <User className="h-16 w-16 text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Create DEX Account</h2>
          <p className="text-gray-400">
            Set up your account to start trading on the decentralized exchange
          </p>
        </div>

        <div className="mb-6">
          <label className="block text-white font-medium mb-2">Security Level</label>
          <select
            value={securityLevel}
            onChange={(e) => setSecurityLevel(e.target.value as any)}
            className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-2 text-white"
          >
            <option value="basic">Basic - Standard security</option>
            <option value="enhanced">Enhanced - Additional confirmations</option>
            <option value="premium">Premium - Maximum security</option>
          </select>
        </div>

        <div className="bg-white/5 rounded-lg p-4 mb-6">
          <h3 className="text-white font-medium mb-2">Account Benefits:</h3>
          <ul className="text-gray-300 text-sm space-y-1">
            <li>• Trade tokens with low fees</li>
            <li>• Access to liquidity pools and farming</li>
            <li>• Portfolio tracking and analytics</li>
            <li>• Transaction history and reporting</li>
            <li>• Enhanced security protocols</li>
          </ul>
        </div>

        <button
          onClick={handleCreateAccount}
          disabled={loading}
          className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 text-white font-medium py-3 rounded-lg transition-all duration-200"
        >
          {loading ? 'Creating Account...' : 'Create DEX Account'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Account Header */}
      <div className="glass-morphism p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <CheckCircle className="h-6 w-6 text-green-400" />
            <h2 className="text-xl font-bold text-white">DEX Account Active</h2>
          </div>
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-blue-400" />
            <span className="text-blue-400 text-sm font-medium">Secured</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Wallet className="h-4 w-4 text-purple-400" />
              <span className="text-gray-400 text-sm">Balance</span>
            </div>
            <div className="text-white font-bold text-lg">{account.balance.toFixed(4)} SOL</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-400" />
              <span className="text-gray-400 text-sm">Portfolio Value</span>
            </div>
            <div className="text-white font-bold text-lg">${account.portfolioValue.toFixed(2)}</div>
          </div>
          
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <TrendingUp className="h-4 w-4 text-blue-400" />
              <span className="text-gray-400 text-sm">Total Trades</span>
            </div>
            <div className="text-white font-bold text-lg">{account.totalTrades}</div>
          </div>
        </div>
      </div>

      {/* Account Info */}
      <div className="glass-morphism p-6">
        <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-gray-400">Public Key:</span>
            <span className="text-white font-mono text-sm">
              {account.publicKey.slice(0, 8)}...{account.publicKey.slice(-8)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Created:</span>
            <span className="text-white">{new Date(account.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Last Activity:</span>
            <span className="text-white">{new Date(account.lastActivity).toLocaleString()}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">Status:</span>
            <span className={`${account.isActive ? 'text-green-400' : 'text-red-400'}`}>
              {account.isActive ? 'Active' : 'Inactive'}
            </span>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-morphism p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Recent Transactions</h3>
          <button
            onClick={handleTestTransaction}
            className="text-purple-400 hover:text-purple-300 text-sm transition-colors"
          >
            + Test Transaction
          </button>
        </div>
        
        {account.transactions.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="h-12 w-12 text-gray-500 mx-auto mb-3" />
            <p className="text-gray-400">No transactions yet</p>
          </div>
        ) : (
          <div className="space-y-3">
            {account.transactions.slice(0, 5).map((tx, index) => (
              <div key={index} className="bg-white/5 rounded-lg p-3">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`w-2 h-2 rounded-full ${
                      tx.status === 'success' ? 'bg-green-400' : 
                      tx.status === 'failed' ? 'bg-red-400' : 'bg-yellow-400'
                    }`} />
                    <span className="text-white font-medium capitalize">{tx.type}</span>
                  </div>
                  <span className="text-gray-400 text-sm">
                    {new Date(tx.timestamp).toLocaleTimeString()}
                  </span>
                </div>
                <div className="text-sm text-gray-300">
                  {tx.amount} {tx.fromToken} → {tx.toToken}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4">
        <button
          onClick={loadAccount}
          className="flex items-center justify-center space-x-2 bg-white/10 hover:bg-white/20 text-white py-3 rounded-lg transition-colors"
        >
          <Clock className="h-4 w-4" />
          <span>Refresh</span>
        </button>
        <button className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg transition-colors">
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </button>
      </div>
    </div>
  );
}