import scorum from '@scorum/scorum-js';

scorum.api.setOptions({ url: 'https://prodnet.scorum.com' });
scorum.config.set('address_prefix', 'SCR');
scorum.config.set('chain_id', 'db4007d45f04c1403a7e66a5c66b5b1cdfc2dde8b5335d1d2f116d592ca3dbb1');

export default scorum;