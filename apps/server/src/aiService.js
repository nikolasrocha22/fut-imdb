"use strict";
// apps/server/src/aiService.ts
// Serviço de análise com IA usando Google Gemini 1.5 Flash
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
exports.isAiConfigured = isAiConfigured;
exports.generatePreMatchAnalysis = generatePreMatchAnalysis;
exports.generateLiveCommentary = generateLiveCommentary;
exports.generatePostMatchAnalysis = generatePostMatchAnalysis;
exports.getLatestAnalysis = getLatestAnalysis;
var generative_ai_1 = require("@google/generative-ai");
var db_1 = require("./db");
var genAI = null;
function getAI() {
    if (genAI)
        return genAI;
    var key = process.env.GEMINI_API_KEY;
    if (!key) {
        console.warn('[AI] GEMINI_API_KEY não configurada. Análise IA desabilitada.');
        return null;
    }
    genAI = new generative_ai_1.GoogleGenerativeAI(key);
    return genAI;
}
function isAiConfigured() {
    return !!process.env.GEMINI_API_KEY;
}
// ─── Análise pré-jogo ────────────────────────────────────────────────────────
function generatePreMatchAnalysis(match) {
    return __awaiter(this, void 0, void 0, function () {
        var ai, cached, lineupsText, prompt, model, result, text, err_1;
        var _a, _b, _c, _d, _e, _f;
        return __generator(this, function (_g) {
            switch (_g.label) {
                case 0:
                    ai = getAI();
                    if (!ai)
                        return [2 /*return*/, match.tacticalAnalysis || 'Análise de IA não disponível.'];
                    return [4 /*yield*/, db_1.prisma.aiAnalysis.findFirst({
                            where: { matchId: match.id, type: 'pre_match' },
                            orderBy: { createdAt: 'desc' },
                        })];
                case 1:
                    cached = _g.sent();
                    if (cached)
                        return [2 /*return*/, cached.content];
                    lineupsText = match.lineups
                        ? "\nEscala\u00E7\u00E3o ".concat(match.homeTeam, ": ").concat((_a = match.lineups.home) === null || _a === void 0 ? void 0 : _a.formation, " - ").concat((_c = (_b = match.lineups.home) === null || _b === void 0 ? void 0 : _b.players) === null || _c === void 0 ? void 0 : _c.slice(0, 5).map(function (p) { return p.name; }).join(', '), "...\nEscala\u00E7\u00E3o ").concat(match.awayTeam, ": ").concat((_d = match.lineups.away) === null || _d === void 0 ? void 0 : _d.formation, " - ").concat((_f = (_e = match.lineups.away) === null || _e === void 0 ? void 0 : _e.players) === null || _f === void 0 ? void 0 : _f.slice(0, 5).map(function (p) { return p.name; }).join(', '), "...")
                        : '';
                    prompt = "Voc\u00EA \u00E9 um analista t\u00E1tico de futebol especialista, com linguagem envolvente e t\u00E9cnica. \nFa\u00E7a uma an\u00E1lise pr\u00E9-jogo completa em PORTUGU\u00CAS BRASILEIRO para:\n\n**".concat(match.homeTeam, " x ").concat(match.awayTeam, "**\nCompeti\u00E7\u00E3o: ").concat(match.league, "\nData: ").concat(match.date, " \u00E0s ").concat(match.time, "\nEst\u00E1dio: ").concat(match.stadium, "\n").concat(lineupsText, "\n\nAnalise:\n1. O que esperar taticamente de cada equipe\n2. Jogadores chave a observar\n3. Din\u00E2micas de confronto (press\u00E3o alta, transi\u00E7\u00F5es, bola parada)\n4. Seu progn\u00F3stico para o resultado\n\nSeja espec\u00EDfico, t\u00E9cnico e envolvente. Use no m\u00E1ximo 350 palavras. N\u00E3o use markdown com asteriscos, escreva em par\u00E1grafos fluidos.");
                    _g.label = 2;
                case 2:
                    _g.trys.push([2, 5, , 6]);
                    model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
                    return [4 /*yield*/, model.generateContent(prompt)];
                case 3:
                    result = _g.sent();
                    text = result.response.text();
                    // Persiste no cache
                    return [4 /*yield*/, db_1.prisma.aiAnalysis.create({
                            data: { matchId: match.id, type: 'pre_match', minute: 0, content: text },
                        })];
                case 4:
                    // Persiste no cache
                    _g.sent();
                    return [2 /*return*/, text];
                case 5:
                    err_1 = _g.sent();
                    console.error('[AI] Erro ao gerar análise pré-jogo:', err_1.message);
                    return [2 /*return*/, match.tacticalAnalysis || 'Análise temporariamente indisponível.'];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ─── Comentário ao vivo (chamado a cada 5 min) ────────────────────────────────
function generateLiveCommentary(match, stats, recentEvents) {
    return __awaiter(this, void 0, void 0, function () {
        var ai, minute, periodKey, cached, statsText, eventsText, prompt, model, result, text, err_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ai = getAI();
                    if (!ai)
                        return [2 /*return*/, ''];
                    minute = match.liveMinute;
                    periodKey = Math.floor(minute / 5) * 5;
                    return [4 /*yield*/, db_1.prisma.aiAnalysis.findFirst({
                            where: {
                                matchId: match.id,
                                type: 'live',
                                minute: { gte: periodKey, lt: periodKey + 5 },
                            },
                        })];
                case 1:
                    cached = _a.sent();
                    if (cached)
                        return [2 /*return*/, cached.content];
                    statsText = stats ? "\nEstat\u00EDsticas ao vivo:\n- Posse: ".concat(match.homeTeam, " ").concat(stats.possession.home, "% x ").concat(match.awayTeam, " ").concat(stats.possession.away, "%\n- Chutes (no gol): ").concat(match.homeTeam, " ").concat(stats.shotsOnGoal.home, " (").concat(stats.shotsTotal.home, " total) x ").concat(match.awayTeam, " ").concat(stats.shotsOnGoal.away, " (").concat(stats.shotsTotal.away, " total)\n- Passes: ").concat(match.homeTeam, " ").concat(stats.passesTotal.home, " x ").concat(match.awayTeam, " ").concat(stats.passesTotal.away, "\n- Escanteios: ").concat(match.homeTeam, " ").concat(stats.corners.home, " x ").concat(match.awayTeam, " ").concat(stats.corners.away, "\n- Faltas: ").concat(match.homeTeam, " ").concat(stats.fouls.home, " x ").concat(match.awayTeam, " ").concat(stats.fouls.away) : '';
                    eventsText = recentEvents.length > 0
                        ? '\nÚltimos eventos:\n' + recentEvents.slice(-5).map(function (e) { return "Min ".concat(e.minute, ": ").concat(e.detail); }).join('\n')
                        : '';
                    prompt = "Voc\u00EA \u00E9 um comentarista de futebol ao vivo, com linguagem din\u00E2mica e t\u00E9cnica em PORTUGU\u00CAS BRASILEIRO.\n\nJogo ao vivo \u2014 Minuto ".concat(minute, ":\n").concat(match.homeTeam, " ").concat(match.scoreHome, " x ").concat(match.scoreAway, " ").concat(match.awayTeam, "\n").concat(statsText, "\n").concat(eventsText, "\n\nEscreva um par\u00E1grafo curto e envolvente (m\u00E1ximo 120 palavras) sobre o momento atual do jogo. \nComente o ritmo, quem est\u00E1 dominando e o que pode acontecer. Seja din\u00E2mico como um comentarista real.\nN\u00E3o use markdown. N\u00E3o repita os n\u00FAmeros de estat\u00EDsticas verbalmente \u2014 interprete-os.");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
                    return [4 /*yield*/, model.generateContent(prompt)];
                case 3:
                    result = _a.sent();
                    text = result.response.text();
                    return [4 /*yield*/, db_1.prisma.aiAnalysis.create({
                            data: { matchId: match.id, type: 'live', minute: minute, content: text },
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, text];
                case 5:
                    err_2 = _a.sent();
                    console.error('[AI] Erro ao gerar comentário ao vivo:', err_2.message);
                    return [2 /*return*/, ''];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ─── Análise pós-jogo ────────────────────────────────────────────────────────
function generatePostMatchAnalysis(match, stats) {
    return __awaiter(this, void 0, void 0, function () {
        var ai, cached, statsText, goalsText, prompt, model, result, text, err_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    ai = getAI();
                    if (!ai)
                        return [2 /*return*/, ''];
                    return [4 /*yield*/, db_1.prisma.aiAnalysis.findFirst({
                            where: { matchId: match.id, type: 'post_match' },
                        })];
                case 1:
                    cached = _a.sent();
                    if (cached)
                        return [2 /*return*/, cached.content];
                    statsText = stats ? "\nEstat\u00EDsticas finais:\n- Posse: ".concat(match.homeTeam, " ").concat(stats.possession.home, "% x ").concat(match.awayTeam, " ").concat(stats.possession.away, "%\n- Chutes no gol: ").concat(match.homeTeam, " ").concat(stats.shotsOnGoal.home, " x ").concat(match.awayTeam, " ").concat(stats.shotsOnGoal.away, "\n- Passes: ").concat(match.homeTeam, " ").concat(stats.passesTotal.home, " x ").concat(match.awayTeam, " ").concat(stats.passesTotal.away, "\n- Faltas: ").concat(match.homeTeam, " ").concat(stats.fouls.home, " x ").concat(match.awayTeam, " ").concat(stats.fouls.away) : '';
                    goalsText = match.timeline
                        .filter(function (e) { return e.type === 'goal'; })
                        .map(function (e) { return "Min ".concat(e.minute, ": ").concat(e.detail); })
                        .join('\n');
                    prompt = "Voc\u00EA \u00E9 um analista t\u00E1tico de futebol de alto n\u00EDvel. Escreva uma an\u00E1lise p\u00F3s-jogo completa em PORTUGU\u00CAS BRASILEIRO.\n\n**Resultado Final: ".concat(match.homeTeam, " ").concat(match.scoreHome, " x ").concat(match.scoreAway, " ").concat(match.awayTeam, "**\nCompeti\u00E7\u00E3o: ").concat(match.league, "\n\nGols:\n").concat(goalsText || 'Nenhum gol', "\n").concat(statsText, "\n\nAnalise:\n1. O que decidiu o jogo taticamente\n2. As fases do jogo e os momentos-chave\n3. Os destaques individuais\n4. O que cada time acertou e errou\n5. Impacto no campeonato / classifica\u00E7\u00E3o\n\nUse no m\u00E1ximo 400 palavras. Seja t\u00E9cnico e envolvente. Escreva em par\u00E1grafos sem markdown.");
                    _a.label = 2;
                case 2:
                    _a.trys.push([2, 5, , 6]);
                    model = ai.getGenerativeModel({ model: 'gemini-2.0-flash' });
                    return [4 /*yield*/, model.generateContent(prompt)];
                case 3:
                    result = _a.sent();
                    text = result.response.text();
                    return [4 /*yield*/, db_1.prisma.aiAnalysis.create({
                            data: { matchId: match.id, type: 'post_match', minute: 999, content: text },
                        })];
                case 4:
                    _a.sent();
                    return [2 /*return*/, text];
                case 5:
                    err_3 = _a.sent();
                    console.error('[AI] Erro ao gerar análise pós-jogo:', err_3.message);
                    return [2 /*return*/, ''];
                case 6: return [2 /*return*/];
            }
        });
    });
}
// ─── Buscar análise mais recente de uma partida ───────────────────────────────
function getLatestAnalysis(matchId, type) {
    return __awaiter(this, void 0, void 0, function () {
        var analysis, _a;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    _b.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, db_1.prisma.aiAnalysis.findFirst({
                            where: __assign({ matchId: matchId }, (type ? { type: type } : {})),
                            orderBy: { createdAt: 'desc' },
                        })];
                case 1:
                    analysis = _b.sent();
                    return [2 /*return*/, (analysis === null || analysis === void 0 ? void 0 : analysis.content) || null];
                case 2:
                    _a = _b.sent();
                    return [2 /*return*/, null];
                case 3: return [2 /*return*/];
            }
        });
    });
}
