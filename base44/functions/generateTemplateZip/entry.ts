import { createClientFromRequest } from 'npm:@base44/sdk@0.8.38';
import JSZip from 'npm:jszip@3.10.1';

Deno.serve(async (req) => {
  try {
    const base44 = createClientFromRequest(req);
    const user = await base44.auth.me();
    if (!user) return Response.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { files, readme } = body;

    if (!files || !Array.isArray(files)) {
      return Response.json({ error: 'files array required' }, { status: 400 });
    }

    const zip = new JSZip();
    const root = zip.folder('landing-page-template');

    for (const f of files) {
      root.file(f.path, f.content);
    }
    if (readme) {
      root.file('README.md', readme);
    }

    const zipBlob = await zip.generateAsync({
      type: 'blob',
      compression: 'DEFLATE',
      compressionOptions: { level: 6 },
    });

    const file = new File([zipBlob], 'landing-page-template.zip', {
      type: 'application/zip',
    });

    const result = await base44.asServiceRole.integrations.Core.UploadFile({
      file: file,
    });

    return Response.json({
      url: result.file_url,
      fileCount: files.length,
      sizeKB: Math.round(zipBlob.size / 1024),
    });
  } catch (error) {
    return Response.json(
      { error: error.message, stack: error.stack },
      { status: 500 }
    );
  }
});