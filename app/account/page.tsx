import { AccountManager } from '@/components/auth/AccountManager';

export default function AccountPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-4">Account Management</h1>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Manage your DEX account, view your trading history, and configure your security settings.
            </p>
          </div>
          
          <AccountManager />
        </div>
      </div>
    </div>
  );
}