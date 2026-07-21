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
  let voiceUrl = '';

  // 1. Upload voice message to Storage bucket if provided
  if (orderData.voiceFile) {
    try {
      const fileExt = orderData.voiceFile.name.split('.').pop();
      const fileName = `${Date.now()}_voice_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { data: uploadData, error: uploadError } = await client.storage
        .from('receipts')
        .upload(filePath, orderData.voiceFile);

      if (!uploadError) {
        const { data: publicUrlData } = client.storage
          .from('receipts')
          .getPublicUrl(filePath);
        voiceUrl = publicUrlData.publicUrl;
      } else {
        console.error('Storage upload error for voice message:', uploadError);
      }
    } catch (e) {
      console.error('Failed uploading voice file:', e);
    }
  }

  // 2. Upload receipt screenshot to Storage bucket if provided
  if (file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await client.storage
      .from('receipts')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error:', uploadError);
      throw new Error(`Failed to upload screenshot: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = client.storage
      .from('receipts')
      .getPublicUrl(filePath);

    screenshotUrl = publicUrlData.publicUrl;
  }

  // Combine design theme, notes, and voice url into one JSON string for design_theme column
  const combinedThemePayload = JSON.stringify({
    theme: orderData.design_theme,
    notes: orderData.notes || '',
    voice_url: voiceUrl,
    utr: orderData.utr || ''
  });

  // 3. Insert record into Postgres 'orders' table
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
        design_theme: combinedThemePayload,
        screenshot_url: screenshotUrl
      }
    ]);

  if (error) {
    console.error('Database insert error:', error);
    throw new Error(`Failed to save order to database: ${error.message}`);
  }

  return { success: true, data };
}

/**
 * Fetches all orders from the Supabase Postgres table.
 */
async function fetchOrdersFromSupabase() {
  const client = getSupabaseClient();
  if (!client) {
    // Return mock data for demo mode
    return {
      success: true,
      mock: true,
      data: [
        {
          id: 1,
          name: "Rajesh Kumar",
          email: "rajesh@example.com",
          phone: "+91 98765 12345",
          service: "Website Development",
          plan: "Premium Plan",
          price: 150000,
          design_theme: JSON.stringify({
            theme: "Modern",
            notes: "Need a high-performance modern portfolio website with GSAP animations.",
            voice_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
            utr: "987654321012"
          }),
          screenshot_url: "https://images.unsplash.com/photo-1557200134-90327ee9fafa?auto=format&fit=crop&w=500&q=80",
          created_at: new Date(Date.now() - 3600000 * 3).toISOString()
        },
        {
          id: 2,
          name: "Sanjana Mehta",
          email: "sanjana@mehta.org",
          phone: "+91 91234 56789",
          service: "Digital Marketing",
          plan: "Standard Plan",
          price: 85000,
          design_theme: JSON.stringify({
            theme: "Creative",
            notes: "Targeting tech professionals. Prefer gradients.",
            voice_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
            utr: "887766554433"
          }),
          screenshot_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=500&q=80",
          created_at: new Date(Date.now() - 3600000 * 20).toISOString()
        },
        {
          id: 3,
          name: "Vikram Singh",
          email: "vikram@singh.in",
          phone: "+91 99887 76655",
          service: "SEO / SMO",
          plan: "Growth Plan",
          price: 45000,
          design_theme: JSON.stringify({
            theme: "Minimal",
            notes: "Boost local search visibility.",
            voice_url: "",
            utr: "112233445566"
          }),
          screenshot_url: "https://images.unsplash.com/photo-1579621970563-ebec7560ff3e?auto=format&fit=crop&w=500&q=80",
          created_at: new Date(Date.now() - 3600000 * 48).toISOString()
        }
      ]
    };
  }

  const { data, error } = await client
    .from('orders')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Database fetch error:', error);
    throw new Error(`Failed to fetch orders from database: ${error.message}`);
  }

  return { success: true, data };
}

/**
 * Updates an order's payload in the Supabase orders table.
 */
async function updateOrderPayloadInSupabase(orderId, updatedPayload) {
  const client = getSupabaseClient();
  if (!client) {
    // Demo mode: mock success
    console.log('Mocking status update:', orderId, updatedPayload);
    return { success: true, mock: true };
  }

  const { data, error } = await client
    .from('orders')
    .update({ design_theme: updatedPayload })
    .eq('id', orderId);

  if (error) {
    console.error('Database update error:', error);
    throw new Error(`Failed to update order in database: ${error.message}`);
  }

  return { success: true, data };
}

/**
 * Handles the career application submission and database insertion.
 */
async function submitApplicationToSupabase(appData, file) {
  const client = getSupabaseClient();
  if (!client) {
    console.log('Mocking application database submission:', appData);
    return { success: true, mock: true };
  }

  let resumeUrl = '';

  // 1. Upload resume to Storage bucket 'receipts' if provided
  if (file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}_resume_${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
    const filePath = `${fileName}`;

    const { data: uploadData, error: uploadError } = await client.storage
      .from('receipts')
      .upload(filePath, file);

    if (uploadError) {
      console.error('Storage upload error for resume:', uploadError);
      throw new Error(`Failed to upload resume: ${uploadError.message}`);
    }

    // Get public URL
    const { data: publicUrlData } = client.storage
      .from('receipts')
      .getPublicUrl(filePath);

    resumeUrl = publicUrlData.publicUrl;
  }

  // 2. Insert record into Postgres 'applications' table
  try {
    const { data, error } = await client
      .from('applications')
      .insert([
        {
          name: appData.name,
          email: appData.email,
          phone: appData.phone,
          designation: appData.designation,
          resume_url: resumeUrl
        }
      ]);

    if (error) {
      console.warn('Database insert error for applications (falling back):', error);
      if (error.code === '42P01') {
        console.log('Applications table does not exist. Handled gracefully (demo fallback). Data:', appData);
        return { success: true, mock: true, warning: 'applications_table_missing' };
      }
      throw new Error(`Failed to save application: ${error.message}`);
    }

    return { success: true, data };
  } catch (err) {
    console.error('Caught error during application save:', err);
    if (err.message.includes('42P01') || err.message.includes('relation "applications" does not exist') || err.message.includes('table')) {
      console.log('Relation applications does not exist. Simulating submission.');
      return { success: true, mock: true, warning: 'applications_table_missing' };
    }
    throw err;
  }
}



