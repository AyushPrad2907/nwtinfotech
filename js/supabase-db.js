// Initialize Supabase Client
let supabaseClient = null;

function getSupabaseClient() {
  if (!supabaseClient) {
    if (SUPABASE_URL === 'YOUR_SUPABASE_URL_HERE' || SUPABASE_ANON_KEY === 'YOUR_SUPABASE_ANON_KEY_HERE') {
      console.warn('Supabase credentials not configured in js/supabase-config.js. Running in demo mode.');
      return null;
    }
    const { createClient } = window.supabase;
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
  return supabaseClient;
}

/**
 * Handles the checkout file upload and database insertion.
 */
async function submitOrderToSupabase(orderData, file) {
  const client = getSupabaseClient();
  if (!client) {
    // If not configured, mock success for testing
    console.log('Mocking database submission:', orderData);
    return { success: true, mock: true };
  }

  let screenshotUrl = '';

  // 1. Upload receipt screenshot to Storage bucket if provided
  if (file) {
    const fileExt = file.name.split('.').pop();
    const fileName = \\_\.\\;
    const filePath = \\\;

    const { data: uploadData, error: uploadError } = await client.storage
      .from('receipts')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(\Failed to upload screenshot: \\);
    }

    // Get public URL
    const { data: publicUrlData } = client.storage
      .from('receipts')
      .getPublicUrl(filePath);

    screenshotUrl = publicUrlData.publicUrl;
  }

  // 2. Insert record into Postgres 'orders' table
  const { data, error } = await client
    .from('orders')
    .insert([
      {
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        service: orderData.service,
        plan: orderData.plan,
        price: parseInt(orderData.price, 10),
        design_theme: orderData.design_theme,
        screenshot_url: screenshotUrl
      }
    ]);

  if (error) {
    console.error('Database insert error:', error);
    throw new Error(\Failed to save order to database: \\);
  }

  return { success: true, data };
}
