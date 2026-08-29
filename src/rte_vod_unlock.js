// Patches the Worker constructor to intercept fetch inside Twitch's Amazon IVS worker.
// When a usher VOD request returns 403 (sub-only), constructs a synthetic m3u8
// from direct CDN URLs. Must load before Twitch spawns IVS workers.
//
// WORKER_PATCH must remain a plain string. Do not embed a function and call
// toString() — production esbuild keepNames injects a helper (`c`) into function
// bodies, and that helper is not available inside the Worker (ReferenceError).

(function initVodUnlock() {
	if (window.__rteVodUnlockReady) return;
	window.__rteVodUnlockReady = true;

	const WORKER_PATCH = [
		'(function () {',
		"\tconst CLIENT_ID = 'kimne78kx3ncx6brgo4mv6wki5h1ko';",
		"\tconst QUALITIES = ['chunked', '1080p60', '720p60', '480p30', '360p30', '160p30'];",
		'\tconst QUALITY_INFO = {',
		"\t\tchunked: {res: '1920x1080', fps: 60, bw: 8534030},",
		"\t\t'1080p60': {res: '1920x1080', fps: 60, bw: 6000000},",
		"\t\t'720p60': {res: '1280x720', fps: 60, bw: 3500000},",
		"\t\t'480p30': {res: '854x480', fps: 30, bw: 1500000},",
		"\t\t'360p30': {res: '640x360', fps: 30, bw: 750000},",
		"\t\t'160p30': {res: '284x160', fps: 30, bw: 300000},",
		'\t};',
		'',
		'\tconst _origFetch = self.fetch;',
		'',
		'\tfunction _gqlMeta(vodId) {',
		"\t\treturn _origFetch('https://gql.twitch.tv/gql', {",
		"\t\t\tmethod: 'POST',",
		"\t\t\theaders: {'Client-ID': CLIENT_ID, 'Content-Type': 'application/json'},",
		'\t\t\tbody: JSON.stringify({',
		'\t\t\t\tquery: \'query{video(id:"\' + vodId + \'"){broadcastType createdAt seekPreviewsURL owner{login}}}\',',
		'\t\t\t}),',
		'\t\t})',
		'\t\t\t.then(function (r) { return r.json(); })',
		'\t\t\t.then(function (d) { return d && d.data && d.data.video; });',
		'\t}',
		'',
		'\tfunction _checkQuality(url) {',
		"\t\treturn _origFetch(url, {cache: 'force-cache'})",
		'\t\t\t.then(function (r) {',
		'\t\t\t\tif (!r.ok) return null;',
		'\t\t\t\treturn r.text().then(function (txt) {',
		"\t\t\t\t\tif (txt.indexOf('.ts') !== -1) return 'avc1.4D001E';",
		"\t\t\t\t\tif (txt.indexOf('.mp4') !== -1) return 'avc1.4D001E';",
		'\t\t\t\t\treturn null;',
		'\t\t\t\t});',
		'\t\t\t})',
		'\t\t\t.catch(function () { return null; });',
		'\t}',
		'',
		'\tfunction _buildVodUrl(domain, vodSpecialId, vodId, login, type, createdAt, quality) {',
		"\t\tif (type === 'highlight') {",
		"\t\t\treturn 'https://' + domain + '/' + vodSpecialId + '/' + quality + '/highlight-' + vodId + '.m3u8';",
		'\t\t}',
		"\t\tif (type === 'upload') {",
		'\t\t\tvar created = new Date(createdAt);',
		'\t\t\tvar cutoff = new Date();',
		'\t\t\tcutoff.setDate(cutoff.getDate() - 7);',
		'\t\t\tif (created < cutoff) {',
		"\t\t\t\treturn 'https://' + domain + '/' + login + '/' + vodId + '/' + vodSpecialId + '/' + quality + '/index-dvr.m3u8';",
		'\t\t\t}',
		'\t\t}',
		"\t\treturn 'https://' + domain + '/' + vodSpecialId + '/' + quality + '/index-dvr.m3u8';",
		'\t}',
		'',
		'\tfunction _buildPlaylist(vodId, isV2) {',
		'\t\treturn _gqlMeta(vodId).then(function (video) {',
		'\t\t\tif (!video || !video.seekPreviewsURL) return null;',
		'',
		'\t\t\tvar parsed = new URL(video.seekPreviewsURL);',
		'\t\t\tvar domain = parsed.host;',
		"\t\t\tvar parts = parsed.pathname.split('/');",
		'\t\t\tvar sbIdx = -1;',
		'\t\t\tfor (var i = 0; i < parts.length; i++) {',
		"\t\t\t\tif (parts[i].indexOf('storyboards') !== -1) {",
		'\t\t\t\t\tsbIdx = i;',
		'\t\t\t\t\tbreak;',
		'\t\t\t\t}',
		'\t\t\t}',
		'\t\t\tif (sbIdx < 1) return null;',
		'',
		'\t\t\tvar vodSpecialId = parts[sbIdx - 1];',
		"\t\t\tvar type = (video.broadcastType || '').toLowerCase();",
		"\t\t\tvar login = video.owner ? video.owner.login : '';",
		"\t\t\tvar createdAt = video.createdAt || '';",
		'',
		'\t\t\tvar playlist =',
		'\t\t\t\t\'#EXTM3U\\n#EXT-X-TWITCH-INFO:ORIGIN="s3",B="false",REGION="EU",USER-IP="0.0.0.0",SERVING-ID="na",CLUSTER="cloudfront_vod",USER-COUNTRY="US",MANIFEST-CLUSTER="cloudfront_vod"\\n\';',
		'\t\t\tvar bw = 8534030;',
		'\t\t\tvar idx = 0;',
		'',
		'\t\t\tfunction next() {',
		'\t\t\t\tif (idx >= QUALITIES.length) {',
		"\t\t\t\t\treturn playlist.indexOf('EXT-X-STREAM-INF') !== -1 ? playlist : null;",
		'\t\t\t\t}',
		'\t\t\t\tvar q = QUALITIES[idx++];',
		'\t\t\t\tvar m3u8 = _buildVodUrl(domain, vodSpecialId, vodId, login, type, createdAt, q);',
		'\t\t\t\treturn _checkQuality(m3u8).then(function (codec) {',
		'\t\t\t\t\tif (codec) {',
		'\t\t\t\t\t\tvar info = QUALITY_INFO[q];',
		'\t\t\t\t\t\tif (isV2) {',
		'\t\t\t\t\t\t\tplaylist += \'#EXT-X-STREAM-INF:BANDWIDTH=\' + bw + \',CODECS="\' + codec + \',mp4a.40.2",RESOLUTION=\' + info.res + \',FRAME-RATE=\' + info.fps + \',STABLE-VARIANT-ID="\' + q + \'",IVS-NAME="\' + q + \'",IVS-VARIANT-SOURCE="transcode"\\n\';',
		'\t\t\t\t\t\t} else {',
		'\t\t\t\t\t\t\tplaylist += \'#EXT-X-MEDIA:TYPE=VIDEO,GROUP-ID="\' + q + \'",NAME="\' + q + \'",AUTOSELECT=YES,DEFAULT=YES\\n\';',
		'\t\t\t\t\t\t\tplaylist += \'#EXT-X-STREAM-INF:BANDWIDTH=\' + bw + \',CODECS="\' + codec + \',mp4a.40.2",RESOLUTION=\' + info.res + \',VIDEO="\' + q + \'",FRAME-RATE=\' + info.fps + \'\\n\';',
		'\t\t\t\t\t\t}',
		"\t\t\t\t\t\tplaylist += m3u8 + '\\n';",
		'\t\t\t\t\t\tbw -= 100;',
		'\t\t\t\t\t}',
		'\t\t\t\t\treturn next();',
		'\t\t\t\t});',
		'\t\t\t}',
		'',
		'\t\t\treturn next();',
		'\t\t});',
		'\t}',
		'',
		'\tself.fetch = function patchedFetch(input, init) {',
		'\t\tvar url = input instanceof Request ? input.url : String(input);',
		'',
		'\t\treturn _origFetch.apply(self, arguments).then(function (response) {',
		"\t\t\tif (url.indexOf('cloudfront') !== -1 && url.indexOf('.m3u8') !== -1) {",
		'\t\t\t\treturn response.text().then(function (body) {',
		"\t\t\t\t\treturn new Response(body.replace(/-unmuted/g, '-muted'), {",
		'\t\t\t\t\t\tstatus: response.status,',
		'\t\t\t\t\t\theaders: response.headers,',
		'\t\t\t\t\t});',
		'\t\t\t\t});',
		'\t\t\t}',
		'',
		"\t\t\tif (url.indexOf('usher.ttvnw.net/vod/') !== -1 && response.status !== 200) {",
		"\t\t\t\tvar vodId = url.split('.m3u8')[0].split('/').pop();",
		"\t\t\t\tvar isV2 = url.indexOf('/v2/') !== -1;",
		'',
		'\t\t\t\treturn _buildPlaylist(vodId, isV2).then(function (playlist) {',
		'\t\t\t\t\tif (playlist) {',
		'\t\t\t\t\t\treturn new Response(playlist, {',
		'\t\t\t\t\t\t\tstatus: 200,',
		"\t\t\t\t\t\t\theaders: {'Content-Type': 'application/vnd.apple.mpegurl'},",
		'\t\t\t\t\t\t});',
		'\t\t\t\t\t}',
		'\t\t\t\t\treturn response;',
		'\t\t\t\t});',
		'\t\t\t}',
		'',
		'\t\t\treturn response;',
		'\t\t});',
		'\t};',
		'})();',
	].join('\n');

	function readWorkerSource(url) {
		const xhr = new XMLHttpRequest();
		xhr.open('GET', url, false);
		xhr.overrideMimeType('text/javascript');
		xhr.send();
		return xhr.responseText;
	}

	const OldWorker = window.Worker;

	window.Worker = class PatchedWorker extends OldWorker {
		constructor(twitchBlobUrl) {
			// replaceAll is Chrome 85+; keep regex replace for older Chromium.
			const workerString = readWorkerSource(String(twitchBlobUrl).replace(/'/g, '%27'));
			const blobUrl = URL.createObjectURL(
				new Blob([WORKER_PATCH + '\n' + workerString], {type: 'application/javascript'})
			);
			super(blobUrl);
		}
	};
})();
