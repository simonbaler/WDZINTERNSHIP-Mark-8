import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useSiteSettingsStore } from '@/store/siteSettingsStore';

export default function AdminWelcomeVideo() {
  const navigate = useNavigate();
  const { welcomeVideoUrl, setWelcomeVideoUrl, clearWelcomeVideoUrl } = useSiteSettingsStore();
  const [url, setUrl] = useState(welcomeVideoUrl || '');
  const [fileBlobUrl, setFileBlobUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  useEffect(() => {
    setUrl(welcomeVideoUrl || '');
  }, [welcomeVideoUrl]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    // Revoke any previous blob URL to avoid leaks
    if (fileBlobUrl) {
      try { URL.revokeObjectURL(fileBlobUrl); } catch {}
    }
    if (file) {
      const blobUrl = URL.createObjectURL(file);
      setFileBlobUrl(blobUrl);
      setFileName(file.name);
    } else {
      setFileBlobUrl(null);
      setFileName(null);
    }
  };

  const handleSave = () => {
    const trimmed = url.trim();
    if (!trimmed) {
      toast.error('Please enter a valid video URL');
      return;
    }
    setWelcomeVideoUrl(trimmed);
    toast.success('Welcome video URL saved');
  };

  const handleDelete = () => {
    clearWelcomeVideoUrl();
    setUrl('');
    if (fileBlobUrl) {
      try { URL.revokeObjectURL(fileBlobUrl); } catch {}
      setFileBlobUrl(null);
      setFileName(null);
    }
    toast.success('Welcome video URL removed');
  };

  const handleUseSelectedFile = () => {
    if (!fileBlobUrl) {
      toast.error('Please choose a video file first');
      return;
    }
    setWelcomeVideoUrl(fileBlobUrl);
    toast.success('Welcome video set from selected file');
  };

  return (
    <div className="min-h-screen bg-background py-12">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Welcome Video</h1>
          <p className="text-muted-foreground">Set the intro video shown on the Welcome page.</p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Video Source</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="welcome-video-url">Video URL</Label>
              <Input
                id="welcome-video-url"
                placeholder="https://cdn.example.com/intro.mp4"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
              <p className="text-xs text-muted-foreground mt-2">Supported formats: MP4, WebM. Ensure the URL is publicly accessible.</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="welcome-video-file">Or import from your device</Label>
              <Input id="welcome-video-file" type="file" accept="video/*" onChange={handleFileChange} />
              {fileName && (
                <p className="text-xs text-muted-foreground">Selected: {fileName}</p>
              )}
              <div className="flex gap-2">
                <Button variant="secondary" onClick={handleUseSelectedFile} disabled={!fileBlobUrl}>
                  Use Selected File
                </Button>
                {fileBlobUrl && (
                  <Button variant="ghost" onClick={() => { try { URL.revokeObjectURL(fileBlobUrl!); } catch {}; setFileBlobUrl(null); setFileName(null); }}>
                    Clear Selection
                  </Button>
                )}
              </div>
              <p className="text-xs text-muted-foreground">Note: Local file selection uses a temporary browser URL. For persistence across sessions, prefer a hosted URL.</p>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave}>Save</Button>
              <Button variant="destructive" onClick={handleDelete}>Delete</Button>
              <Button variant="outline" asChild>
                <Link to={welcomeVideoUrl ? '/welcome' : '/welcome?src=https://www.w3schools.com/html/mov_bbb.mp4'}>
                  Preview Intro
                </Link>
              </Button>
              <Button variant="outline" onClick={() => navigate('/admin')}>Back to Dashboard</Button>
            </div>

            {welcomeVideoUrl && (
              <div className="mt-6">
                <Label>Current Preview</Label>
                <div className="mt-2 aspect-video bg-muted rounded-lg overflow-hidden">
                  <video src={welcomeVideoUrl} controls className="w-full h-full object-cover" />
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}