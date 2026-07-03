"use strict";
// apps/server/src/syncService.ts
// Serviço de sincronização diária de partidas com a API-Football
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
exports.syncTodayMatches = syncTodayMatches;
exports.startSyncService = startSyncService;
var node_cron_1 = require("node-cron");
var db_1 = require("./db");
var footballService_1 = require("./footballService");
var aiService_1 = require("./aiService");
// Emojis para times brasileiros e seleções (fallback quando API não tem logo)
var EMOJI_MAP = {
    'Flamengo': '🔴', 'Vasco': '⚫', 'Palmeiras': '🟢', 'Corinthians': '⚫',
    'São Paulo': '🔴', 'Santos': '⚫', 'Grêmio': '🔵', 'Internacional': '🔴',
    'Atletico Mineiro': '⚫', 'Botafogo': '⚫', 'Fluminense': '🔴',
    'Fortaleza': '🔵', 'Ceará': '⚫', 'Sport': '🔴', 'Bahia': '🔵',
    'Cuiabá': '🟡', 'América-MG': '🟢', 'Ponte Preta': '⚫',
    'Brasil': '🟡', 'Argentina': '🔵', 'França': '🔵', 'Alemanha': '⚪',
    'Espanha': '🔴', 'Portugal': '🟢', 'Itália': '🔵', 'Inglaterra': '⚪',
    'Croácia': '⬜', 'Áustria': '🔴',
};
function getTeamEmoji(teamName) {
    return EMOJI_MAP[teamName] || '⚽';
}
/**
 * Sincroniza as partidas do dia com o banco de dados.
 * Cria novas partidas e atualiza as existentes por externalId.
 */
function syncTodayMatches(date) {
    return __awaiter(this, void 0, void 0, function () {
        var fixtures, synced, _i, fixtures_1, fix, err_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    if (!(0, footballService_1.isApiConfigured)()) {
                        console.log('[Sync] API-Football não configurada. Usando dados locais de seed.');
                        return [2 /*return*/, 0];
                    }
                    return [4 /*yield*/, (0, footballService_1.fetchTodayFixtures)(date)];
                case 1:
                    fixtures = _a.sent();
                    if (!fixtures.length) {
                        console.log('[Sync] Nenhuma partida encontrada para sincronizar.');
                        return [2 /*return*/, 0];
                    }
                    synced = 0;
                    _i = 0, fixtures_1 = fixtures;
                    _a.label = 2;
                case 2:
                    if (!(_i < fixtures_1.length)) return [3 /*break*/, 7];
                    fix = fixtures_1[_i];
                    _a.label = 3;
                case 3:
                    _a.trys.push([3, 5, , 6]);
                    return [4 /*yield*/, upsertFixture(fix)];
                case 4:
                    _a.sent();
                    synced++;
                    return [3 /*break*/, 6];
                case 5:
                    err_1 = _a.sent();
                    console.error("[Sync] Erro ao sincronizar ".concat(fix.homeTeam, " x ").concat(fix.awayTeam, ":"), err_1.message);
                    return [3 /*break*/, 6];
                case 6:
                    _i++;
                    return [3 /*break*/, 2];
                case 7:
                    console.log("[Sync] ".concat(synced, "/").concat(fixtures.length, " partidas sincronizadas com sucesso."));
                    return [2 /*return*/, synced];
            }
        });
    });
}
/**
 * Cria ou atualiza uma partida no banco por externalId.
 */
function upsertFixture(fix) {
    return __awaiter(this, void 0, void 0, function () {
        var matchId, lineupsJson, lineups, _a, tacticalAnalysis, existing, initialRating, initialVotes, data;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    matchId = "api-".concat(fix.externalId);
                    lineupsJson = null;
                    _b.label = 1;
                case 1:
                    _b.trys.push([1, 4, , 5]);
                    if (!(fix.status !== 'scheduled')) return [3 /*break*/, 3];
                    return [4 /*yield*/, (0, footballService_1.fetchFixtureLineups)(fix.externalId)];
                case 2:
                    lineups = _b.sent();
                    if (lineups)
                        lineupsJson = JSON.stringify(lineups);
                    _b.label = 3;
                case 3: return [3 /*break*/, 5];
                case 4:
                    _a = _b.sent();
                    return [3 /*break*/, 5];
                case 5: return [4 /*yield*/, (0, aiService_1.generatePreMatchAnalysis)({
                        id: matchId,
                        homeTeam: fix.homeTeam,
                        awayTeam: fix.awayTeam,
                        league: fix.league,
                        stadium: fix.stadium,
                        date: fix.date,
                        time: fix.time,
                        lineups: lineupsJson ? JSON.parse(lineupsJson) : null,
                        tacticalAnalysis: ''
                    })];
                case 6:
                    tacticalAnalysis = _b.sent();
                    return [4 /*yield*/, db_1.prisma.match.findUnique({ where: { id: matchId } })];
                case 7:
                    existing = _b.sent();
                    initialRating = existing ? existing.rating : parseFloat((Math.random() * (9.5 - 6.0) + 6.0).toFixed(1));
                    initialVotes = existing ? existing.votes : Math.floor(Math.random() * (5000 - 500) + 500);
                    data = __assign({ league: fix.league, leagueEmoji: fix.leagueEmoji, homeTeam: fix.homeTeam, homeEmoji: getTeamEmoji(fix.homeTeam), homeLogoUrl: fix.homeLogo || null, awayTeam: fix.awayTeam, awayEmoji: getTeamEmoji(fix.awayTeam), awayLogoUrl: fix.awayLogo || null, status: fix.status, scoreHome: fix.scoreHome, scoreAway: fix.scoreAway, penHome: fix.penHome, penAway: fix.penAway, date: fix.date, time: fix.time, stadium: fix.stadium ? "".concat(fix.stadium, ", ").concat(fix.city).replace(', ', ', ').replace(/,\s*$/, '') : 'A definir', referee: fix.referee, liveMinute: fix.liveMinute, externalId: fix.externalId, tacticalAnalysis: tacticalAnalysis, timeline: '[]', rating: initialRating, votes: initialVotes }, (lineupsJson && { lineups: lineupsJson }));
                    return [4 /*yield*/, db_1.prisma.match.upsert({
                            where: { id: matchId },
                            create: __assign({ id: matchId }, data),
                            update: __assign({ status: data.status, scoreHome: data.scoreHome, scoreAway: data.scoreAway, penHome: data.penHome, penAway: data.penAway, liveMinute: data.liveMinute, homeLogoUrl: data.homeLogoUrl, awayLogoUrl: data.awayLogoUrl, tacticalAnalysis: data.tacticalAnalysis }, (lineupsJson && { lineups: lineupsJson })),
                        })];
                case 8:
                    _b.sent();
                    return [2 /*return*/];
            }
        });
    });
}
/**
 * Inicia o cron job de sincronização.
 * Executa todo dia às 06:00 BRT (09:00 UTC) e ao iniciar o servidor.
 */
function startSyncService() {
    var _this = this;
    if (!(0, footballService_1.isApiConfigured)()) {
        console.log('[SyncService] Desabilitado — configure FOOTBALL_API_KEY para ativar.');
        return;
    }
    // Executa na inicialização (com 5s de delay para o banco estar pronto)
    setTimeout(function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[SyncService] Executando sincronização inicial...');
                    return [4 /*yield*/, syncTodayMatches()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, 5000);
    // Cron: todo dia às 06:00 (horário de São Paulo = UTC-3 = 09:00 UTC)
    node_cron_1.default.schedule('0 9 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[SyncService] Cron de 06:00 BRT disparado — sincronizando partidas do dia...');
                    return [4 /*yield*/, syncTodayMatches()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, { timezone: 'UTC' });
    // Cron adicional: a cada hora durante o dia (para capturar partidas recém-anunciadas)
    node_cron_1.default.schedule('0 12-2 * * *', function () { return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    console.log('[SyncService] Atualização horária de fixtures...');
                    return [4 /*yield*/, syncTodayMatches()];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    }); }, { timezone: 'UTC' });
    console.log('[SyncService] Agendado: sincronização às 06:00 BRT + atualização horária.');
}
