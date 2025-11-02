import { put, del, list } from '@vercel/blob';

const BLOB_TOKEN = process.env.BLOB_READ_WRITE_TOKEN;

export async function saveProjects(projects: any[]) {
  if (!BLOB_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN not configured');
  }
  
  // Delete old blob if it exists
  try {
    const { blobs } = await list({ token: BLOB_TOKEN, prefix: 'portfolio-projects' });
    for (const blob of blobs) {
      await del(blob.url, { token: BLOB_TOKEN });
    }
  } catch (error) {
    // Ignore if blob doesn't exist
  }
  
  // Create new blob with timestamp to ensure uniqueness
  const timestamp = Date.now();
  const blob = await put(`portfolio-projects-${timestamp}.json`, JSON.stringify({ projects }, null, 2), {
    access: 'public',
    contentType: 'application/json',
    token: BLOB_TOKEN,
  });
  
  return blob;
}

export async function saveMediaConfig(mediaConfig: any) {
  if (!BLOB_TOKEN) {
    throw new Error('BLOB_READ_WRITE_TOKEN not configured');
  }
  
  // Delete old blob if it exists
  try {
    const { blobs } = await list({ token: BLOB_TOKEN, prefix: 'portfolio-media' });
    for (const blob of blobs) {
      await del(blob.url, { token: BLOB_TOKEN });
    }
  } catch (error) {
    // Ignore if blob doesn't exist
  }
  
  // Create new blob with timestamp to ensure uniqueness
  const timestamp = Date.now();
  const blob = await put(`portfolio-media-${timestamp}.json`, JSON.stringify(mediaConfig, null, 2), {
    access: 'public',
    contentType: 'application/json',
    token: BLOB_TOKEN,
  });
  
  return blob;
}

export async function getProjects() {
  if (!BLOB_TOKEN) {
    // Fallback to local data if no token
    const localData = await import('@/data/projects.json');
    return localData.default;
  }

  try {
    // List all project blobs and get the latest one
    const { blobs } = await list({ token: BLOB_TOKEN, prefix: 'portfolio-projects' });
    
    if (blobs.length > 0) {
      // Sort by creation date (newest first)
      const latestBlob = blobs.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )[0];
      
      const response = await fetch(latestBlob.url, { cache: 'no-store' });
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.log('Blob not found, using local data', error);
  }
  
  // Fallback to local data
  const localData = await import('@/data/projects.json');
  return localData.default;
}

export async function getMediaConfig() {
  if (!BLOB_TOKEN) {
    // Fallback to local data if no token
    const localData = await import('@/data/media.json');
    return localData.default;
  }

  try {
    // List all media blobs and get the latest one
    const { blobs } = await list({ token: BLOB_TOKEN, prefix: 'portfolio-media' });
    
    if (blobs.length > 0) {
      // Sort by creation date (newest first)
      const latestBlob = blobs.sort((a, b) => 
        new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime()
      )[0];
      
      const response = await fetch(latestBlob.url, { cache: 'no-store' });
      if (response.ok) {
        return await response.json();
      }
    }
  } catch (error) {
    console.log('Blob not found, using local data', error);
  }
  
  // Fallback to local data
  const localData = await import('@/data/media.json');
  return localData.default;
}
