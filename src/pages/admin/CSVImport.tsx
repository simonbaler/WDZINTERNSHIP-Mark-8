import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Upload, FileText, AlertCircle, CheckCircle2, XCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

export default function CSVImport() {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
    }
  };

  const parseCSV = (text: string): any[] => {
    const lines = text.split('\n').filter(line => line.trim());
    if (lines.length === 0) return [];

    const headers = lines[0].split(',').map(h => h.trim());
    const rows = [];

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',').map(v => v.trim());
      if (values.length === headers.length) {
        const row: any = {};
        headers.forEach((header, index) => {
          row[header] = values[index];
        });
        rows.push(row);
      }
    }

    return rows;
  };

  const handleImport = async (dryRun: boolean) => {
    if (!file) {
      toast.error('Please select a CSV file');
      return;
    }

    setImporting(true);
    setResult(null);

    try {
      const text = await file.text();
      const csvData = parseCSV(text);

      if (csvData.length === 0) {
        toast.error('No valid data found in CSV');
        setImporting(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('csv-import', {
        body: { csvData, dryRun },
      });

      if (error) throw error;

      setResult(data);
      
      if (dryRun) {
        toast.success('Dry run completed - no data was imported');
      } else {
        toast.success(`Import completed! ${data.inserted} products imported`);
      }
    } catch (error) {
      console.error('Import error:', error);
      toast.error('Import failed');
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'name,slug,brand,price,original_price,stock,description,is_active,is_featured,images,specifications\n' +
      'Canon EOS R5,canon-eos-r5,Canon,249900,299900,10,"Professional mirrorless camera",true,true,"https://example.com/r5.jpg","{\\"sensor\\":\\"45MP Full Frame\\"}"\n' +
      'Sony A7 IV,sony-a7-iv,Sony,199900,229900,15,"Hybrid mirrorless camera",true,false,"https://example.com/a7iv.jpg","{\\"sensor\\":\\"33MP Full Frame\\"}"';
    
    const blob = new Blob([template], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'products_template.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="container mx-auto p-6 space-y-6 max-w-4xl">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">CSV Bulk Import</h1>
          <p className="text-muted-foreground">Import products from CSV file</p>
        </div>
        <Button variant="outline" onClick={downloadTemplate}>
          <Download className="mr-2 h-4 w-4" />
          Download Template
        </Button>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          <strong>CSV Format:</strong> name, slug, brand, price, original_price, stock, description, is_active, is_featured, images, specifications
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Upload CSV File</CardTitle>
          <CardDescription>Select a CSV file to import products</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              accept=".csv"
              onChange={handleFileChange}
              className="hidden"
              id="csv-upload"
              disabled={importing}
            />
            <label htmlFor="csv-upload" className="cursor-pointer">
              {file ? (
                <div className="space-y-2">
                  <FileText className="h-12 w-12 mx-auto text-primary" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <Upload className="h-12 w-12 mx-auto text-muted-foreground" />
                  <p className="font-medium">Click to upload CSV</p>
                  <p className="text-sm text-muted-foreground">
                    Or drag and drop your file here
                  </p>
                </div>
              )}
            </label>
          </div>

          {file && (
            <div className="flex gap-2">
              <Button
                onClick={() => handleImport(true)}
                disabled={importing}
                variant="outline"
                className="flex-1"
              >
                {importing ? 'Processing...' : 'Dry Run (Validate Only)'}
              </Button>
              <Button
                onClick={() => handleImport(false)}
                disabled={importing}
                className="flex-1"
              >
                {importing ? 'Processing...' : 'Import Products'}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Import Results</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-muted rounded-lg">
                <div className="text-2xl font-bold">{result.totalRows}</div>
                <div className="text-sm text-muted-foreground">Total Rows</div>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {result.validRows}
                </div>
                <div className="text-sm text-muted-foreground">Valid</div>
              </div>
              <div className="text-center p-4 bg-red-50 dark:bg-red-950 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {result.errors?.length || 0}
                </div>
                <div className="text-sm text-muted-foreground">Errors</div>
              </div>
            </div>

            {result.dryRun && (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  This was a dry run. No data was actually imported.
                </AlertDescription>
              </Alert>
            )}

            {!result.dryRun && result.inserted > 0 && (
              <Alert className="bg-green-50 dark:bg-green-950">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-600">
                  Successfully imported {result.inserted} products!
                </AlertDescription>
              </Alert>
            )}

            {result.errors && result.errors.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-semibold flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-destructive" />
                  Validation Errors
                </h4>
                <div className="space-y-1 max-h-64 overflow-y-auto">
                  {result.errors.map((error: any, idx: number) => (
                    <div key={idx} className="text-sm p-2 bg-destructive/10 rounded">
                      <Badge variant="destructive" className="mr-2">
                        Row {error.row}
                      </Badge>
                      <span className="font-medium">{error.field}:</span> {error.message}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
