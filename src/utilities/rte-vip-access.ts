'use strict';

const CACHE_TTL_MS = 5 * 60 * 1000;

let cachedHasSubscription: boolean | null = null;
let cacheTimestamp = 0;

export function invalidateVipAccessCache(): void {
	cachedHasSubscription = null;
	cacheTimestamp = 0;
}

export type SubscriptionCheckResult = {
	has_subscription?: boolean;
	error?: boolean;
	tier?: number;
	current_period_end?: string;
};

function parseSubscriptionResult(data: unknown): SubscriptionCheckResult {
	if (!data || typeof data !== 'object' || (data as SubscriptionCheckResult).error) {
		return {has_subscription: false, error: true};
	}

	return {
		has_subscription: (data as SubscriptionCheckResult).has_subscription === true,
		error: false
	};
}

export async function checkSubscription(proxyBase: string | null, twitchId: string): Promise<SubscriptionCheckResult> {
	try {
		if (!proxyBase || !twitchId) {
			return {has_subscription: false, error: true};
		}

		const response = await fetch(`${proxyBase}/api/subscription/check/${encodeURIComponent(twitchId)}`);
		if (!response.ok) {
			return {has_subscription: false, error: true};
		}

		return parseSubscriptionResult(await response.json());
	} catch {
		return {has_subscription: false, error: true};
	}
}

export async function hasRteSubscription(
	proxyBase: string | null,
	twitchId: string | null,
	forceRefresh = false
): Promise<boolean> {
	if (!twitchId) {
		return false;
	}

	const now = Date.now();
	if (!forceRefresh && cachedHasSubscription === true && now - cacheTimestamp < CACHE_TTL_MS) {
		return true;
	}

	const result = await checkSubscription(proxyBase, twitchId);

	if (result?.error) {
		invalidateVipAccessCache();
		return false;
	}

	cachedHasSubscription = result.has_subscription === true;
	cacheTimestamp = now;
	return cachedHasSubscription;
}

export function openSubscriptionPage(): void {
	window.open('https://ext.rte.net.ru', '_blank');
}
