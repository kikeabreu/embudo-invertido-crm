const DAY_MS = 24 * 60 * 60 * 1000;

const atNoon = (value) => {
    if (!value) return null;
    const raw = String(value).slice(0, 10);
    const date = new Date(`${raw}T12:00:00`);
    return Number.isNaN(date.getTime()) ? null : date;
};

const dateKey = (date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
};

const addContractMonths = (anchor, months) => {
    const target = new Date(anchor.getFullYear(), anchor.getMonth() + months, 1, 12);
    const lastDay = new Date(target.getFullYear(), target.getMonth() + 1, 0, 12).getDate();
    target.setDate(Math.min(anchor.getDate(), lastDay));
    return target;
};

export const formatOperationalDate = (value, options = {}) => {
    const date = value instanceof Date ? value : atNoon(value);
    if (!date) return "Sin definir";
    return date.toLocaleDateString("es-MX", {
        day: "numeric",
        month: "short",
        year: options.year === false ? undefined : "numeric",
    });
};

export const getClientCycle = (client, now = new Date()) => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    const anchor = atNoon(client?.fecha_contratacion || client?.fecha_corte || client?.created_at)
        || new Date(today.getFullYear(), today.getMonth(), 1, 12);

    let monthIndex = ((today.getFullYear() - anchor.getFullYear()) * 12) + today.getMonth() - anchor.getMonth();
    let start = addContractMonths(anchor, monthIndex);
    if (start > today) {
        monthIndex -= 1;
        start = addContractMonths(anchor, monthIndex);
    }

    const nextStart = addContractMonths(anchor, monthIndex + 1);
    const end = new Date(nextStart.getTime() - DAY_MS);
    const totalDays = Math.max(1, Math.round((end - start) / DAY_MS) + 1);
    const elapsedDays = Math.min(totalDays, Math.max(0, Math.round((today - start) / DAY_MS) + 1));

    return {
        start,
        end,
        startKey: dateKey(start),
        endKey: dateKey(end),
        totalDays,
        elapsedDays,
        daysRemaining: Math.max(0, Math.round((end - today) / DAY_MS)),
        elapsedPct: Math.round((elapsedDays / totalDays) * 100),
    };
};

export const getPieceDate = (piece) => atNoon(
    piece?.fecha_publicada
    || piece?.fecha_prog
    || piece?.updated_at
    || piece?.created_at
);

export const getClientOperation = (client, pieces = [], now = new Date()) => {
    const cycle = getClientCycle(client, now);
    const cyclePieces = pieces.filter(piece => {
        const date = getPieceDate(piece);
        return piece.broker_id === client.id && date && date >= cycle.start && date <= cycle.end;
    });
    const published = cyclePieces.filter(piece => piece.estado === "Publicado").length;
    const committed = Math.max(0, Number(client?.piezas_comprometidas ?? 12) || 0);
    const pending = Math.max(0, committed - published);
    const progress = committed ? Math.min(100, Math.round((published / committed) * 100)) : 0;
    const expected = cycle.elapsedPct;

    let risk = "En curso";
    let riskTone = "#7060D8";
    if (!client?.fecha_contratacion && !client?.fecha_corte) {
        risk = "Sin ciclo";
        riskTone = "#6B7374";
    } else if (!committed) {
        risk = "Sin meta";
        riskTone = "#6B7374";
    } else if (progress >= 100) {
        risk = "Al día";
        riskTone = "#1F9D6B";
    } else if (cycle.daysRemaining <= 2 || progress < expected - 20) {
        risk = "Crítico";
        riskTone = "#E0473C";
    } else if (progress < expected - 8) {
        risk = "Atención";
        riskTone = "#E9A23B";
    }

    const unscheduled = cyclePieces.filter(piece => piece.estado !== "Publicado" && !piece.fecha_prog).length;
    const nextAction = client?.proxima_accion
        || (pending === 0
            ? "Preparar el siguiente ciclo"
            : unscheduled > 0
                ? `Programar ${unscheduled} pieza${unscheduled === 1 ? "" : "s"} sin fecha`
                : `Cerrar ${pending} entrega${pending === 1 ? "" : "s"} pendiente${pending === 1 ? "" : "s"}`);

    return { cycle, cyclePieces, committed, published, pending, progress, expected, risk, riskTone, nextAction };
};

export const getCalendarWindow = (mode, now = new Date()) => {
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12);
    if (mode === "today") return { start: today, end: today };

    const mondayOffset = (today.getDay() + 6) % 7;
    const start = new Date(today);
    start.setDate(today.getDate() - mondayOffset);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return { start, end };
};

export const pieceMatchesOperationalView = (piece, client, mode, now = new Date()) => {
    const date = getPieceDate(piece);
    if (!date) return false;
    if (mode === "month") {
        const cycle = getClientCycle(client, now);
        return date >= cycle.start && date <= cycle.end;
    }
    const window = getCalendarWindow(mode, now);
    return date >= window.start && date <= window.end;
};
