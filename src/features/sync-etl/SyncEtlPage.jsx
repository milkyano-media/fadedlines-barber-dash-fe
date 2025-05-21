import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RefreshCw, Database, FileSpreadsheet } from 'lucide-react';
import { syncEtlService } from './services/syncEtlService';

const SyncEtlPage = () => {
  const [activeTab, setActiveTab] = useState('sync');
  const [syncStatus, setSyncStatus] = useState(null);
  const [etlStatus, setEtlStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [syncInProgress, setSyncInProgress] = useState(false);
  const [etlInProgress, setEtlInProgress] = useState(false);
  const [error, setError] = useState(null);

  // Fetch initial status
  useEffect(() => {
    fetchSyncStatus();
    fetchEtlStatus();
  }, []);

  // Fetch sync status
  const fetchSyncStatus = async () => {
    try {
      setLoading(true);
      const response = await syncEtlService.getSyncStatus();
      setSyncStatus(response.data);
    } catch (err) {
      console.error('Error fetching sync status:', err);
      setError('Failed to load sync status');
    } finally {
      setLoading(false);
    }
  };

  // Fetch ETL status
  const fetchEtlStatus = async () => {
    try {
      setLoading(true);
      const response = await syncEtlService.getEtlStatus();
      setEtlStatus(response.data);
    } catch (err) {
      console.error('Error fetching ETL status:', err);
      setError('Failed to load ETL status');
    } finally {
      setLoading(false);
    }
  };

  // Handle running a sync operation
  const handleSync = async (type) => {
    try {
      setSyncInProgress(true);
      setError(null);
      
      let response;
      switch (type) {
        case 'all':
          response = await syncEtlService.syncAll();
          break;
        case 'customers':
          response = await syncEtlService.syncCustomers();
          break;
        case 'teams':
          response = await syncEtlService.syncTeams();
          break;
        case 'bookingEvents':
          response = await syncEtlService.syncBookingEvents();
          break;
        default:
          throw new Error('Invalid sync type');
      }
      
      // Refresh sync status after operation completes
      fetchSyncStatus();
      
      return response;
    } catch (err) {
      console.error(`Error running ${type} sync:`, err);
      setError(`Failed to run ${type} sync operation`);
    } finally {
      setSyncInProgress(false);
    }
  };

  // Handle running an ETL process
  const handleEtl = async (type) => {
    try {
      setEtlInProgress(true);
      setError(null);
      
      let response;
      switch (type) {
        case 'conversions':
          response = await syncEtlService.processConversions();
          break;
        default:
          throw new Error('Invalid ETL type');
      }
      
      // Refresh ETL status after operation completes
      fetchEtlStatus();
      
      return response;
    } catch (err) {
      console.error(`Error running ${type} ETL:`, err);
      setError(`Failed to run ${type} ETL operation`);
    } finally {
      setEtlInProgress(false);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'Never';
    
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h1 className="text-3xl font-bold">Sync & ETL</h1>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => {
              activeTab === 'sync' ? fetchSyncStatus() : fetchEtlStatus();
            }} 
            disabled={loading || syncInProgress || etlInProgress}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh Status
          </Button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="bg-destructive/10 text-destructive p-4 rounded-md">
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab} 
        className="w-full"
      >
        <TabsList className="grid w-full md:w-[400px] grid-cols-2">
          <TabsTrigger value="sync">Square Sync</TabsTrigger>
          <TabsTrigger value="etl">ETL Processing</TabsTrigger>
        </TabsList>

        {/* Sync Tab */}
        <TabsContent value="sync" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Sync Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>Sync Status</CardTitle>
                <CardDescription>Last synchronization times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Customers</span>
                    <span className="text-sm">{syncStatus ? formatDate(syncStatus.customers) : 'Loading...'}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Team Members</span>
                    <span className="text-sm">{syncStatus ? formatDate(syncStatus.teams) : 'Loading...'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Sync Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>Sync Actions</CardTitle>
                <CardDescription>Run sync operations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button 
                    onClick={() => handleSync('all')} 
                    disabled={syncInProgress}
                    className="w-full"
                  >
                    {syncInProgress ? (
                      <>
                        <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                        Syncing All Data...
                      </>
                    ) : (
                      <>
                        <Database className="mr-2 h-4 w-4" />
                        Sync All Data
                      </>
                    )}
                  </Button>
                  <div className="grid grid-cols-3 gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => handleSync('customers')} 
                      disabled={syncInProgress}
                    >
                      Customers
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSync('teams')} 
                      disabled={syncInProgress}
                    >
                      Team Members
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => handleSync('bookingEvents')} 
                      disabled={syncInProgress}
                    >
                      Booking Events
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ETL Tab */}
        <TabsContent value="etl" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* ETL Status Card */}
            <Card>
              <CardHeader>
                <CardTitle>ETL Status</CardTitle>
                <CardDescription>Last processing times</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Conversions ETL</span>
                    <span className="text-sm">{etlStatus ? formatDate(etlStatus.conversions) : 'Loading...'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* ETL Actions Card */}
            <Card>
              <CardHeader>
                <CardTitle>ETL Actions</CardTitle>
                <CardDescription>Run ETL processes</CardDescription>
              </CardHeader>
              <CardContent>
                <Button 
                  onClick={() => handleEtl('conversions')} 
                  disabled={etlInProgress}
                  className="w-full"
                >
                  {etlInProgress ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Processing Conversions...
                    </>
                  ) : (
                    <>
                      <FileSpreadsheet className="mr-2 h-4 w-4" />
                      Process Conversions
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default SyncEtlPage;
