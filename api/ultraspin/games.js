const API_BASE = 'https://api.ultraspin168.com/api';
const IMAGE_BASE = 'https://ultraspin168.s3.ap-southeast-1.amazonaws.com/games';

function imageUrl(fileName) {
  if (!fileName) return `${IMAGE_BASE}/placeholder.png`;
  return `${IMAGE_BASE}/${encodeURIComponent(fileName)}`;
}

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ ok: false, error: 'method_not_allowed' });
  }

  const requestedPage = Number(req.query?.page || 1);
  const requestedPerPage = Number(req.query?.perPage || 60);
  const page = Number.isInteger(requestedPage) && requestedPage > 0 ? Math.min(requestedPage, 100) : 1;
  const perPage = Number.isInteger(requestedPerPage) && requestedPerPage > 0 ? Math.min(requestedPerPage, 100) : 60;

  try {
    const url = new URL(`${API_BASE}/getGames`);
    url.searchParams.set('page', String(page));
    url.searchParams.set('perPage', String(perPage));

    const response = await fetch(url, { headers: { Accept: 'application/json' } });
    const data = await response.json();
    if (!response.ok) {
      return res.status(response.status).json({ ok: false, error: 'provider_catalog_error' });
    }

    const records = Array.isArray(data?.results?.data) ? data.results.data : [];
    const games = records.map((record) => ({
      id: record.id,
      uid: record.uid,
      game_name: record.game_name,
      game_image: record.game_image,
      game_type: record.game_type,
      game_provider: record.game_provider,
      game_uuid: record.game_uuid,
      has_lobby: record.has_lobby,
      is_mobile: record.is_mobile,
      has_freespins: record.has_freespins,
      has_tables: record.has_tables,
      has_demo: record.has_demo,
      freespin_valid_until_full_day: record.freespin_valid_until_full_day,
      technology: record.technology,
      status: record.status,
      provider: record.provider,
      is_new: record.is_new,
      is_favorite: record.is_favorite,
      category: record.category,
      merchant: record.merchant,
      order: record.order,
      is_buffalo: record.is_buffalo,
      is_skm: record.is_skm,
      is_slot: record.is_slot,
      is_fish: record.is_fish,
      is_arcade: record.is_arcade,
      image: imageUrl(record.game_image),
    }));

    return res.status(200).json({
      ok: true,
      page,
      perPage,
      total: data?.results?.total,
      games,
    });
  } catch (error) {
    return res.status(502).json({
      ok: false,
      error: 'provider_network_error',
      details: error instanceof Error ? error.message : 'Unknown network error',
    });
  }
}
