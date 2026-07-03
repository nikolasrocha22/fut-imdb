"use strict";
// apps/server/src/footballService.ts
// Integração com a API football-data.org
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.STATUS_MAP = void 0;
exports.isApiConfigured = isApiConfigured;
exports.fetchTodayFixtures = fetchTodayFixtures;
exports.fetchLiveFixtures = fetchLiveFixtures;
exports.fetchFixtureEvents = fetchFixtureEvents;
exports.fetchFixtureStatistics = fetchFixtureStatistics;
exports.fetchFixtureLineups = fetchFixtureLineups;
var axios_1 = require("axios");
function getBaseUrl() {
    return "https://".concat(process.env.FOOTBALL_API_HOST || 'api.football-data.org');
}
function getHeaders() {
    var token = process.env.FOOTBALL_API_KEY;
    if (!token)
        return null;
    return { 'X-Auth-Token': token };
}
/** Verifica se a integração com API-Football está configurada */
function isApiConfigured() {
    return !!process.env.FOOTBALL_API_KEY;
}
// Mapa de status da API football-data.org → status do nosso banco
exports.STATUS_MAP = {
    'SCHEDULED': 'scheduled',
    'TIMED': 'scheduled',
    'IN_PLAY': 'live',
    'PAUSED': 'live',
    'FINISHED': 'completed',
    'POSTPONED': 'completed',
    'SUSPENDED': 'live',
    'CANCELED': 'completed',
};
/** Busca partidas de hoje (ou de uma data específica) */
function fetchTodayFixtures(date) {
    return __awaiter(this, void 0, void 0, function () {
        var headers, targetDate, params, response, fixtures, results, err_1;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    headers = getHeaders();
                    if (!headers) {
                        console.warn('[FootballService] FOOTBALL_API_KEY não configurada. Pulando sync.');
                        return [2 /*return*/, []];
                    }
                    targetDate = date || new Date().toISOString().split('T')[0];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    params = {};
                    if (date) {
                        params.dateFrom = date;
                        params.dateTo = date;
                    }
                    return [4 /*yield*/, axios_1.default.get("".concat(getBaseUrl(), "/v4/matches"), {
                            headers: headers,
                            params: params,
                        })];
                case 2:
                    response = _b.sent();
                    fixtures = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.matches) || [];
                    results = fixtures.map(normalizeFixture);
                    console.log("[FootballService] ".concat(results.length, " partidas encontradas para ").concat(targetDate));
                    return [2 /*return*/, results];
                case 3:
                    err_1 = _b.sent();
                    console.error('[FootballService] Erro ao buscar fixtures:', err_1.message);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/** Busca partidas ao vivo agora */
function fetchLiveFixtures() {
    return __awaiter(this, void 0, void 0, function () {
        var headers, response, fixtures, err_2;
        var _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    headers = getHeaders();
                    if (!headers)
                        return [2 /*return*/, []];
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.get("".concat(getBaseUrl(), "/v4/matches"), {
                            headers: headers,
                            params: { status: 'IN_PLAY,PAUSED' },
                        })];
                case 2:
                    response = _b.sent();
                    fixtures = ((_a = response.data) === null || _a === void 0 ? void 0 : _a.matches) || [];
                    return [2 /*return*/, fixtures.map(normalizeFixture)];
                case 3:
                    err_2 = _b.sent();
                    console.error('[FootballService] Erro ao buscar partidas ao vivo:', err_2.message);
                    return [2 /*return*/, []];
                case 4: return [2 /*return*/];
            }
        });
    });
}
/**
 * football-data.org FREE tier limits detailed events, lineups, and statistics.
 * We return mock or empty data to prevent breaking the UI, but relying on AI generation.
 */
function fetchFixtureEvents(fixtureId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, []];
        });
    });
}
function fetchFixtureStatistics(fixtureId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, null];
        });
    });
}
function fetchFixtureLineups(fixtureId) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, null];
        });
    });
}
// ─── Normalizadores ───────────────────────────────────────────────────────────
function normalizeFixture(f) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w;
    var rawStatus = f.status || 'SCHEDULED';
    var utcDate = new Date(f.utcDate);
    return {
        externalId: f.id,
        league: ((_a = f.competition) === null || _a === void 0 ? void 0 : _a.name) || 'Amistoso',
        leagueId: ((_b = f.competition) === null || _b === void 0 ? void 0 : _b.id) || 0,
        leagueEmoji: getLeagueEmoji(((_c = f.competition) === null || _c === void 0 ? void 0 : _c.id) || 0),
        homeTeam: ((_d = f.homeTeam) === null || _d === void 0 ? void 0 : _d.name) || 'Time Mandante',
        homeLogo: ((_e = f.homeTeam) === null || _e === void 0 ? void 0 : _e.crest) || null,
        awayTeam: ((_f = f.awayTeam) === null || _f === void 0 ? void 0 : _f.name) || 'Time Visitante',
        awayLogo: ((_g = f.awayTeam) === null || _g === void 0 ? void 0 : _g.crest) || null,
        status: exports.STATUS_MAP[rawStatus] || 'scheduled',
        rawStatus: rawStatus,
        scoreHome: (_k = (_j = (_h = f.score) === null || _h === void 0 ? void 0 : _h.fullTime) === null || _j === void 0 ? void 0 : _j.home) !== null && _k !== void 0 ? _k : null,
        scoreAway: (_o = (_m = (_l = f.score) === null || _l === void 0 ? void 0 : _l.fullTime) === null || _m === void 0 ? void 0 : _m.away) !== null && _o !== void 0 ? _o : null,
        penHome: (_r = (_q = (_p = f.score) === null || _p === void 0 ? void 0 : _p.penalties) === null || _q === void 0 ? void 0 : _q.home) !== null && _r !== void 0 ? _r : null,
        penAway: (_u = (_t = (_s = f.score) === null || _s === void 0 ? void 0 : _s.penalties) === null || _t === void 0 ? void 0 : _t.away) !== null && _u !== void 0 ? _u : null,
        date: utcDate.toISOString().split('T')[0],
        time: utcDate.toLocaleTimeString('pt-BR', {
            hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo'
        }),
        stadium: 'Estádio Local', // football-data often omits venue in free tier
        city: '',
        referee: ((_w = (_v = f.referees) === null || _v === void 0 ? void 0 : _v[0]) === null || _w === void 0 ? void 0 : _w.name) || 'A definir',
        liveMinute: rawStatus === 'IN_PLAY' ? 45 : null,
    };
}
function getLeagueEmoji(leagueId) {
    var map = {
        2013: '🇧🇷', // Brasileirão
        2000: '🌎', // World Cup
        2001: '🏆', // Champions League
        2018: '🏆', // Euro
        2152: '🌎', // Libertadores
        2021: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', // Premier League
        2014: '🇪🇸', // La Liga
        2002: '🇩🇪', // Bundesliga
        2015: '🇫🇷', // Ligue 1
        2019: '🇮🇹', // Serie A
    };
    return map[leagueId] || '⚽';
}
