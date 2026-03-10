import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const C = {
  bg: "#0D0D0D", card: "#141414", border: "#222",
  text: "#F0EAD6", muted: "#666", dim: "#333",
  gold: "#D4A853", teal: "#3EBFAA", red: "#E05555",
  blue: "#5B8FD4", purple: "#9B72CF", green: "#5BAD7F", coral: "#E07055",
};

// ─── PROYECCIONES ─────────────────────────────────────────────
const weight = 70.1, fatPct = 0.33, fatMass = weight * fatPct;
const leanMass = weight - fatMass;
const bmr = 10 * weight + 6.25 * 158 - 5 * 37 - 161;
const tdee = bmr * 1.5;
const dailyCals = 1600;
const deficit = tdee - dailyCals;
const weeklyFatLoss = (deficit * 7) / 7700;
const weeklyMuscle = 0.055;

function project(days: number) {
  const w = days / 7;
  const fl = Math.min(weeklyFatLoss * w, fatMass - 8);
  const mg = weeklyMuscle * w;
  const nw = weight - fl + mg;
  return { days, weight: +nw.toFixed(1), fatPct: +((fatMass - fl) / nw * 100).toFixed(1), fatLost: +fl.toFixed(1), muscleGained: +(mg * 1000).toFixed(0) };
}
const milestones = [
  { label: "HOY", color: C.muted, ...project(0) },
  { label: "30D", color: C.gold, ...project(30) },
  { label: "60D", color: C.teal, ...project(60) },
  { label: "90D", color: C.purple, ...project(90) },
  { label: "120D", color: C.coral, ...project(120) },
];
const chartData = Array.from({ length: 121 }, (_, i) => ({ day: i, ...project(i) }));

// ─── DIETA ─────────────────────────────────────────────────────
const meals = [
  { name: "☀️ Desayuno", time: "6:45am", protein: 32, carbs: 28, fat: 14, cals: 370, change: "+8g prot vs antes", foods: "4 claras + 1 huevo · 100g camote · ½ aguacate · 1 fruta", tip: "Sube a 4 claras. Mueve las almendras a la merienda de las 4pm." },
  { name: "💪 Post-entreno", time: "~9:30am", protein: 22, carbs: 35, fat: 2, cals: 250, change: "+8g prot vs antes", foods: "200g yogurt GRIEGO 0% · 20g amaranto · 150g fruta", tip: "Yogurt GRIEGO, no normal — casi el doble de proteína. La fruta aquí acelera recuperación." },
  { name: "🍽️ Comida", time: "1:00pm", protein: 42, carbs: 32, fat: 7, cals: 365, change: "+4g prot vs antes", foods: "180g pollo · ½ taza arroz · Vegetales ilimitados · 1 cdta aceite oliva", tip: "Sube de 150g a 180g de pollo. Vegetales no cuentan en el déficit — come todos los que quieras." },
  { name: "🍎 Merienda", time: "4:00pm", protein: 22, carbs: 18, fat: 12, cals: 270, change: "+5g prot vs antes", foods: "4 claras cocidas · 1 manzana · 15 almendras", tip: "Esta merienda a las 4pm es anti-cortisol clave para home office." },
  { name: "🌙 Cena", time: "8:00pm", protein: 38, carbs: 10, fat: 6, cals: 250, change: "+6g prot vs antes", foods: "180g pescado o pollo · Vegetales abundantes · Caldo si tienes hambre", tip: "Salmón 2x/semana: omega 3 natural + reduce inflamación. Sin carbs complejos después de 7pm." },
];
const totalProt = meals.reduce((a, m) => a + m.protein, 0);
const totalCals = meals.reduce((a, m) => a + m.cals, 0);

// ─── CORTISOL ──────────────────────────────────────────────────
const cortisolTips = [
  { icon: "🧘", title: "Box-breathing al despertar", detail: "Antes del celular: 4s inhala · 4s sostén · 4s exhala · 4s sostén. Reduce cortisol matutino ~15%.", urgency: "CRÍTICO", color: C.red },
  { icon: "🖥️", title: "Alarma cada 60 min en home office", detail: "5 min de pie, 10 sentadillas o caminar. Rompe la acumulación de cortisol sedentario.", urgency: "CRÍTICO", color: C.red },
  { icon: "📵", title: "Sin pantalla 30 min antes de dormir", detail: "La luz azul eleva cortisol nocturno y destruye el sueño profundo donde ocurre la quema de grasa.", urgency: "CRÍTICO", color: C.red },
  { icon: "🥗", title: "No saltarte la merienda de 4pm", detail: "Saltarse comidas = pico de cortisol + catabolismo. La tarde es el momento más crítico en HO.", urgency: "IMPORTANTE", color: C.gold },
  { icon: "🧂", title: "Agua con sal de mar al despertar", detail: "Cortisol alto + déficit agota el sodio → fatiga → más cortisol. Un vaso antes del café rompe ese ciclo.", urgency: "IMPORTANTE", color: C.gold },
  { icon: "☕", title: "Café después de las 9am", detail: "El cortisol natural pico es 6–9am. Café en ese pico amplifica el estrés. Espera 60–90 min.", urgency: "IMPORTANTE", color: C.gold },
  { icon: "🌿", title: "Ashwagandha KSM-66 (300–600mg noche)", detail: "Mayor evidencia para reducir cortisol crónico. Compatible con todo tu stack. El suplemento más importante a añadir.", urgency: "RECOMENDADO", color: C.blue },
  { icon: "🏃", title: "Cardio zona 2, no HIIT", detail: "HIIT + déficit + cortisol alto = retención de grasa activa. Zona 2 quema más grasa en tu situación.", urgency: "IMPORTANTE", color: C.gold },
];

const supplements = [
  { sup: "Berberina", dose: "500mg con comidas grandes", status: "✅ Mantén", note: "Sensibilidad insulínica y control glucémico", color: C.green },
  { sup: "D3 + K2", dose: "5000 IU D3 + 100mcg K2 con desayuno", status: "✅ Mantén", note: "Deficiencia de D3 eleva cortisol", color: C.green },
  { sup: "Omega 3", dose: "Sube a 3g EPA+DHA/día", status: "⬆️ Aumenta", note: "A 3g/día reduce cortisol e inflamación tendinosa", color: C.gold },
  { sup: "Vitamina C", dose: "500mg x2 al día", status: "✅ Mantén", note: "1000mg/día reduce cortisol post-ejercicio", color: C.green },
  { sup: "Colágeno + Pilopeptan", dose: "Ayunas o pre-sueño", status: "✅ Mantén", note: "Clave para recuperación del manguito rotador", color: C.green },
  { sup: "Ashwagandha KSM-66", dose: "300–600mg antes de dormir", status: "🆕 AÑADIR", note: "El más importante a agregar — cortisol crónico", color: C.coral },
  { sup: "Magnesio Glicinato", dose: "300mg antes de dormir", status: "🆕 CONSIDERA", note: "Sueño profundo + menos cortisol nocturno", color: C.blue },
];

// ─── RUTINA ───────────────────────────────────────────────────
const days = [
  {
    id: 0, day: "LUN", label: "Pierna · Fuerza", color: C.teal,
    focus: "Cuádriceps · Glúteos · Isquiotibiales",
    cardio: { type: "Caminadora inclinada zona 2", duration: "30 min", detail: "Inclinación 8–10%, velocidad 5–6 km/h" },
    activation: ["Rotación de cadera · 10 cada lado", "Glúteo en cuadrupedia · 15 cada lado", "Sentadilla con peso corporal · 15 reps"],
    shoulder: null, warning: null,
    exercises: [
      { name: "Sentadilla libre con barra", sets: "4", reps: "10–12", rest: "90s", tag: "COMPUESTO", uni: false, note: "Descender controlado 3 seg. Ejercicio principal — no escatimes aquí." },
      { name: "Peso muerto convencional", sets: "4", reps: "8–10", rest: "90s", tag: "COMPUESTO", uni: false, note: "Espalda neutra todo el tiempo. Si sientes el hombro al sujetar la barra, usa straps." },
      { name: "Sentadilla búlgara con mancuernas", sets: "3", reps: "10 c/pierna", rest: "75s", tag: "UNILATERAL", uni: true, note: "Pie trasero elevado en banco. Todo el peso en una pierna. Anota el peso usado en cada lado." },
      { name: "Extensión cuádriceps (unilateral)", sets: "3", reps: "12–15 c/pierna", rest: "45s", tag: "UNILATERAL", uni: true, note: "Una pierna a la vez. Empieza con la más débil, mismo peso en ambas." },
      { name: "Femoral en máquina (unilateral)", sets: "3", reps: "12–15 c/pierna", rest: "45s", tag: "UNILATERAL", uni: true, note: "Una pierna a la vez. Contrae glúteo al hacer el curl." },
    ],
  },
  {
    id: 1, day: "MAR", label: "Tren Sup · Jalón", color: C.blue,
    focus: "Espalda · Bíceps · Hombro posterior",
    cardio: { type: "Elíptica zona 2", duration: "25 min", detail: "Reducido — protege catabolismo en déficit calórico" },
    activation: ["Rotación externa con liga · 15 reps", "Face pulls ligeros · 15 reps", "Retracción escapular · 20 reps"],
    shoulder: "⚠️ Día de jalón puro — sin press. El hombro descansa de empuje.", warning: null,
    exercises: [
      { name: "Remo en máquina (sentada)", sets: "4", reps: "10–12", rest: "75s", tag: "COMPUESTO", uni: false, note: "Omóplatos juntos al final. Ejercicio principal de espalda." },
      { name: "Jalón al pecho en polea alta", sets: "4", reps: "10–12", rest: "75s", tag: "COMPUESTO", uni: false, note: "Agarre ligeramente más ancho que hombros. Jala hacia el pecho, no atrás." },
      { name: "Remo unilateral con mancuerna", sets: "3", reps: "12 c/lado", rest: "60s", tag: "UNILATERAL", uni: true, note: "Empieza con el lado del hombro lesionado. Mismo peso en ambos lados aunque uno se sienta más difícil." },
      { name: "Curl unilateral en polea baja", sets: "3", reps: "12 c/brazo", rest: "60s", tag: "UNILATERAL", uni: true, note: "Tensión constante en todo el rango. Compara fuerza entre brazos — anota diferencias." },
      { name: "Curl martillo alternado", sets: "2", reps: "12–15 c/brazo", rest: "45s", tag: "UNILATERAL", uni: true, note: "Alternado, no simultáneo — fuerza a cada brazo a trabajar solo. Pulgar arriba." },
    ],
  },
  {
    id: 2, day: "MIÉ", label: "Glúteos · Posterior", color: C.purple,
    focus: "Glúteos · Isquiotibiales · Aductores",
    cardio: { type: "Caminadora inclinada zona 2", duration: "30 min", detail: "Inclinación 10–12%, velocidad 4.5–5.5 km/h" },
    activation: ["Puente de glúteo en suelo · 20 reps", "Abductor con liga · 15 c/lado", "PDR peso corporal · 10 reps"],
    shoulder: null, warning: null,
    exercises: [
      { name: "Hip thrust unilateral Smith", sets: "4", reps: "10–12 c/pierna", rest: "75s", tag: "UNILATERAL", uni: true, note: "Misma posición pero una pierna elevada. Detecta si un glúteo trabaja más — común en sedentarismo prolongado." },
      { name: "PDR unilateral con mancuerna", sets: "3", reps: "10 c/pierna", rest: "75s", tag: "UNILATERAL", uni: true, note: "Una mancuerna, una pierna. El pie libre va atrás al bajar. Excelente para equilibrio y detección de desbalances." },
      { name: "Sentadilla búlgara (2ª ronda semanal)", sets: "3", reps: "10 c/pierna", rest: "75s", tag: "UNILATERAL", uni: true, note: "Segunda vez para consolidar el patrón. Enfócate en bajar más lento — más tiempo bajo tensión." },
      { name: "Aductores en máquina", sets: "3", reps: "15–20", rest: "45s", tag: "AISLAMIENTO", uni: false, note: "Cierre lento y controlado. Aductores fuertes protegen rodilla y cadera." },
      { name: "Abductores en máquina", sets: "3", reps: "15–20", rest: "45s", tag: "AISLAMIENTO", uni: false, note: "Apertura controlada. Definición lateral de muslo y estabilidad de cadera." },
    ],
  },
  {
    id: 3, day: "JUE", label: "Hombro · Rehab", color: C.green,
    focus: "Manguito rotador · Cardio largo · Movilidad",
    cardio: { type: "Bicicleta + caminadora suave", duration: "50–60 min", detail: "Zona 2 estricta — puedes hablar sin jadear" },
    activation: null,
    shoulder: "✅ Día del manguito. Anota cómo respondió cada ejercicio para reportar al fisio.",
    warning: "🚫 Sin press, sin jalones pesados, sin remo con carga.",
    exercises: [
      { name: "Rotación externa con liga", sets: "3", reps: "15–20", rest: "30s", tag: "REHAB", uni: false, note: "PESO MUY LIGERO. Sin dolor. El ejercicio más importante del día." },
      { name: "Rotación interna con liga", sets: "3", reps: "15–20", rest: "30s", tag: "REHAB", uni: false, note: "Codo 90° pegado al cuerpo. Lento y controlado." },
      { name: "Face pulls con cuerda", sets: "3", reps: "15–20", rest: "30s", tag: "REHAB", uni: false, note: "Polea a altura de cara. Jala hacia la frente separando codos hacia afuera." },
      { name: "Elevación lateral muy ligera", sets: "3", reps: "12–15", rest: "30s", tag: "REHAB", uni: false, note: "Solo hasta 60–70°, no a 90°. 2–3 kg máximo. Para si duele." },
      { name: "Retracción escapular en polea baja", sets: "3", reps: "20", rest: "30s", tag: "REHAB", uni: false, note: "Junta omóplatos sin doblar codos. Activa romboides y serratos." },
    ],
  },
  {
    id: 4, day: "VIE", label: "Tren Sup · Empuje", color: C.gold,
    focus: "Pecho · Tríceps · Hombro anterior",
    cardio: { type: "Elíptica o caminadora zona 2", duration: "25 min", detail: "" },
    activation: ["Rotación externa con liga · 15 reps", "Face pulls · 15 reps", "Círculos de hombro controlados · 10 c/dir"],
    shoulder: "⚠️ Mancuernas siempre, nunca barra. Para si llegas a 4/10 de molestia en hombro.", warning: null,
    exercises: [
      { name: "Press inclinado mancuernas (alternado)", sets: "4", reps: "10–12 c/brazo", rest: "75s", tag: "UNILATERAL", uni: true, note: "El lado lesionado marca el peso. Codos NO bajen del nivel del pecho. Mancuernas permiten ángulo natural." },
      { name: "Aperturas unilaterales en polea baja", sets: "3", reps: "12–15 c/brazo", rest: "60s", note: "Un cable a la vez. Compara rango de movimiento entre hombros. Arco suave, codo ligeramente doblado.", tag: "UNILATERAL", uni: true },
      { name: "Tríceps en polea alta (cuerda)", sets: "3", reps: "12–15", rest: "60s", tag: "AISLAMIENTO", uni: false, note: "Codos pegados al cuerpo. Extensión completa abajo separando la cuerda." },
      { name: "Tríceps unilateral en polea (asa)", sets: "3", reps: "12–15 c/brazo", rest: "45s", tag: "UNILATERAL", uni: true, note: "Un brazo a la vez. Detecta si el tríceps del lado lesionado está menos desarrollado." },
      { name: "Elevación frontal con disco", sets: "2", reps: "12", rest: "45s", tag: "AISLAMIENTO", uni: false, note: "Ambas manos en el disco — reduce carga unilateral al hombro. Solo hasta altura de hombros." },
    ],
  },
  {
    id: 5, day: "SÁB", label: "Descanso Activo", color: C.muted,
    focus: "Movilidad · Caminata · Recuperación",
    cardio: { type: "Caminata con tus perras", duration: "30–45 min", detail: "Ritmo cómodo, no ejercicio" },
    activation: null, shoulder: null, warning: null,
    exercises: [
      { name: "Stretching cuádriceps y flexores", sets: "—", reps: "30s c/lado x3", rest: "—", tag: "MOVILIDAD", uni: false, note: "Flexores tensos por home office. Estirar aquí mejora postura y previene dolor lumbar." },
      { name: "Postura del niño (espalda baja)", sets: "—", reps: "60s x3", rest: "—", tag: "MOVILIDAD", uni: false, note: "Contrarrestar horas sentada frente al computador." },
      { name: "Foam roller muslos y glúteos", sets: "—", reps: "2 min c/zona", rest: "—", tag: "MOVILIDAD", uni: false, note: "Reduce DOMS y mejora circulación para la semana siguiente." },
    ],
  },
  {
    id: 6, day: "DOM", label: "Descanso Total", color: C.muted,
    focus: "Recuperación completa", cardio: null, activation: null, shoulder: null,
    warning: "El músculo crece aquí, no en el gym. Come tus proteínas, duerme 7h, relájate.",
    exercises: [],
  },
];

const tagColors: Record<string, string> = { COMPUESTO: C.teal, UNILATERAL: C.purple, AISLAMIENTO: C.gold, REHAB: C.green, MOVILIDAD: C.blue };

// ─── PROGRESS TRACKING ────────────────────────────────────────
const START_DATE = new Date("2026-03-09");

function dateKey(date: Date): string {
  return date.toISOString().split("T")[0];
}

function getDaysBetween(a: Date, b: Date): number {
  return Math.floor((b.getTime() - a.getTime()) / 86400000);
}

function loadProgress(): Record<string, Record<string, boolean>> {
  try {
    const raw = localStorage.getItem("fitness_progress");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

function saveProgress(data: Record<string, Record<string, boolean>>) {
  try { localStorage.setItem("fitness_progress", JSON.stringify(data)); } catch {}
}

const CHECKS = [
  { id: "rutina", label: "💪 Hice mi rutina / caminata" },
  { id: "dieta", label: "🥗 Seguí mi plan de comidas" },
  { id: "proteina", label: "🥚 Llegué a ~140g de proteína" },
  { id: "cortisol", label: "🧘 Hice box-breathing al despertar" },
  { id: "agua", label: "💧 Bebí agua con sal en ayunas" },
  { id: "pantalla", label: "📵 Sin pantalla 30 min antes de dormir" },
];

// ─── MAIN COMPONENT ───────────────────────────────────────────
export default function App() {
  const [section, setSection] = useState("inicio");
  const [activeDay, setActiveDay] = useState<number>(0);
  const [expandedEx, setExpandedEx] = useState<number | null>(null);
  const [expandedMeal, setExpandedMeal] = useState<number | null>(null);
  const [progress, setProgress] = useState<Record<string, Record<string, boolean>>>(loadProgress);
  const [calMonth, setCalMonth] = useState(0); // 0 = mes actual del inicio
  const d = days[activeDay];

  const todayKey = dateKey(new Date());

  function toggleCheck(checkId: string) {
    const updated = {
      ...progress,
      [todayKey]: { ...(progress[todayKey] || {}), [checkId]: !(progress[todayKey]?.[checkId]) }
    };
    setProgress(updated);
    saveProgress(updated);
  }

  function getDayColor(key: string) {
    const checks = progress[key];
    if (!checks) return null;
    const done = Object.values(checks).filter(Boolean).length;
    if (done >= 5) return C.green;
    if (done >= 3) return C.gold;
    if (done >= 1) return C.coral;
    return C.dim;
  }

  // Streak calculator
  function getStreak(): number {
    let streak = 0;
    const today = new Date();
    for (let i = 0; i <= 120; i++) {
      const d2 = new Date(today);
      d2.setDate(today.getDate() - i);
      const key = dateKey(d2);
      const checks = progress[key];
      const done = checks ? Object.values(checks).filter(Boolean).length : 0;
      if (done >= 3) streak++;
      else if (i > 0) break;
    }
    return streak;
  }

  // Calendar grid for 120 days
  function getCalendarDays() {
    const allDays = [];
    for (let i = 0; i < 120; i++) {
      const d2 = new Date(START_DATE);
      d2.setDate(START_DATE.getDate() + i);
      allDays.push(d2);
    }
    return allDays;
  }

  const calDays = getCalendarDays();
  const todayChecks = progress[todayKey] || {};
  const todayDone = Object.values(todayChecks).filter(Boolean).length;
  const streak = getStreak();
  const totalDaysLogged = Object.keys(progress).filter(k => {
    const checks = progress[k];
    return checks && Object.values(checks).filter(Boolean).length >= 3;
  }).length;

  const navItems = [
    { id: "inicio", icon: "🏠", label: "Inicio" },
    { id: "progreso", icon: "📅", label: "Progreso" },
    { id: "rutina", icon: "💪", label: "Rutina" },
    { id: "dieta", icon: "🥗", label: "Dieta" },
    { id: "metas", icon: "📈", label: "Metas" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", fontFamily: "'Georgia', serif", color: C.text, maxWidth: 430, margin: "0 auto", paddingBottom: 70 }}>

      {/* ── HEADER ── */}
      <div style={{ background: `linear-gradient(135deg, #141414 0%, #0F2040 100%)`, padding: "22px 18px 16px", borderBottom: `2px solid ${C.gold}` }}>
        <p style={{ margin: "0 0 2px", fontSize: 9, letterSpacing: 4, color: C.gold, textTransform: "uppercase" }}>Reinicio · 9 Marzo 2026</p>
        <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700, color: C.text }}>Mi Plan de Transformación</h1>
        <p style={{ margin: "4px 0 0", fontSize: 11, color: C.muted }}>37 años · 158 cm · 70.1 kg · 33% grasa</p>
      </div>

      <div style={{ padding: "16px" }}>

        {/* ══════════ INICIO ══════════ */}
        {section === "inicio" && (
          <div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Peso actual", val: "70.1 kg", color: C.gold },
                { label: "% Grasa", val: "~33%", color: C.coral },
                { label: "Masa magra", val: `${leanMass.toFixed(1)} kg`, color: C.teal },
                { label: "Meta 120 días", val: `${project(120).fatPct}% grasa`, color: C.green },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "12px 14px" }}>
                  <div style={{ fontSize: 10, color: C.muted }}>{label}</div>
                  <div style={{ fontSize: 18, fontWeight: 800, color }}>{val}</div>
                </div>
              ))}
            </div>

            {/* Why stagnation */}
            <div style={{ background: `${C.coral}10`, border: `1px solid ${C.coral}30`, borderRadius: 12, padding: 16, marginBottom: 14 }}>
              <div style={{ fontWeight: 700, color: C.coral, fontSize: 13, marginBottom: 8 }}>🔍 Por qué no viste cambios en 4 semanas</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
                <b style={{ color: C.text }}>Cortisol alto</b> → retiene agua y bloquea quema de grasa.<br />
                <b style={{ color: C.text }}>Proteína insuficiente</b> → catabolismo que enmascara la pérdida.<br />
                <b style={{ color: C.text }}>Home office</b> → TDEE real ~10% menor de lo calculado.<br />
                <b style={{ color: C.green }}>Los ajustes de hoy cambian todo eso. ✅</b>
              </div>
            </div>

            {/* Quick links */}
            <div style={{ fontSize: 11, color: C.muted, marginBottom: 10, letterSpacing: 2, textTransform: "uppercase" }}>Acceso rápido</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {[
                { id: "rutina", icon: "💪", title: "Ver rutina de hoy", sub: "5 días · unilateral · zona 2", color: C.teal },
                { id: "dieta", icon: "🥗", title: "Plan alimentario", sub: `~${totalCals} kcal · ${totalProt}g proteína`, color: C.gold },
                { id: "metas", icon: "📈", title: "Proyecciones", sub: "30 · 60 · 90 · 120 días", color: C.purple },
                { id: "progreso", icon: "📅", title: "Mi progreso", sub: "Checklist + calendario", color: C.green },
              ].map(({ id, icon, title, sub, color }) => (
                <div key={id} onClick={() => setSection(id)} style={{
                  background: C.card, border: `1px solid ${color}30`,
                  borderRadius: 10, padding: "14px 12px", cursor: "pointer",
                }}>
                  <div style={{ fontSize: 22, marginBottom: 6 }}>{icon}</div>
                  <div style={{ fontSize: 12, fontWeight: 700, color, lineHeight: 1.3 }}>{title}</div>
                  <div style={{ fontSize: 10, color: C.muted, marginTop: 3 }}>{sub}</div>
                </div>
              ))}
            </div>

            {/* Deload reminder */}
            <div style={{ marginTop: 14, padding: "12px 14px", background: `${C.gold}10`, border: `1px solid ${C.gold}25`, borderRadius: 10 }}>
              <span style={{ color: C.gold, fontWeight: 700, fontSize: 12 }}>⚡ Deload semana 6, 12 y 18</span>
              <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>Mismos ejercicios, 50% series y peso. No es perder progreso — es multiplicarlo.</div>
            </div>

            {/* Measurement protocol */}
            <div style={{ marginTop: 14, background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.green, marginBottom: 10 }}>📏 Mide cada 2 semanas (en ayunas)</div>
              {["Cintura — al nivel del ombligo", "Cadera — punto más ancho", "Muslo derecho — mitad entre rodilla e ingle", "Brazo derecho — mitad del bícep relajado"].map(z => (
                <div key={z} style={{ fontSize: 11, color: C.muted, padding: "5px 0", borderBottom: `1px solid ${C.dim}` }}>· {z}</div>
              ))}
              <div style={{ fontSize: 11, color: C.green, marginTop: 8 }}>✅ Cintura bajando = recomposición activa, aunque la báscula no se mueva.</div>
            </div>
          </div>
        )}

        {/* ══════════ RUTINA ══════════ */}
        {section === "rutina" && (
          <div>
            {/* Day selector */}
            <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 16, paddingBottom: 4 }}>
              {days.map((dy, i) => (
                <button key={i} onClick={() => { setActiveDay(i); setExpandedEx(null); }} style={{
                  background: activeDay === i ? dy.color : C.card,
                  border: `1px solid ${activeDay === i ? dy.color : C.border}`,
                  borderRadius: 8, padding: "8px 10px", cursor: "pointer", minWidth: 50, textAlign: "center",
                }}>
                  <div style={{ fontSize: 10, fontWeight: 700, color: activeDay === i ? C.bg : C.muted }}>{dy.day}</div>
                </button>
              ))}
            </div>

            {/* Day title */}
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 4 }}>
              <div style={{ width: 4, height: 30, background: d.color, borderRadius: 2 }} />
              <div>
                <div style={{ fontSize: 9, color: d.color, letterSpacing: 3, textTransform: "uppercase" }}>{d.day}</div>
                <div style={{ fontSize: 17, fontWeight: 700, color: C.text }}>{d.label}</div>
              </div>
            </div>
            <div style={{ fontSize: 11, color: C.muted, marginLeft: 14, marginBottom: 14 }}>{d.focus}</div>

            {d.shoulder && (
              <div style={{ background: d.shoulder.startsWith("✅") ? `${C.green}12` : `${C.gold}12`, border: `1px solid ${d.shoulder.startsWith("✅") ? C.green : C.gold}30`, borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 11, color: d.shoulder.startsWith("✅") ? C.green : C.gold, lineHeight: 1.6 }}>{d.shoulder}</div>
            )}
            {d.warning && (
              <div style={{ background: `${C.red}10`, border: `1px solid ${C.red}25`, borderRadius: 8, padding: "10px 12px", marginBottom: 12, fontSize: 11, color: C.red, lineHeight: 1.6 }}>{d.warning}</div>
            )}

            {/* Activation */}
            {d.activation && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 12, marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: C.teal, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>🔥 Activación (5 min)</div>
                {d.activation.map((a, i) => <div key={i} style={{ fontSize: 11, color: C.muted, padding: "3px 0", borderBottom: i < d.activation.length - 1 ? `1px solid ${C.dim}` : "none" }}>· {a}</div>)}
              </div>
            )}

            {/* Exercises */}
            {d.exercises.length > 0 && (
              <div style={{ marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Ejercicios</div>
                {d.exercises.map((ex, i) => (
                  <div key={i} style={{ marginBottom: 8 }}>
                    <div onClick={() => setExpandedEx(expandedEx === i ? null : i)} style={{
                      background: C.card, border: `1px solid ${expandedEx === i ? d.color : C.border}`,
                      borderRadius: expandedEx === i ? "10px 10px 0 0" : 10, padding: "12px 14px", cursor: "pointer",
                    }}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ display: "flex", gap: 6, marginBottom: 4 }}>
                            <span style={{ fontSize: 8, padding: "2px 5px", borderRadius: 3, background: `${tagColors[ex.tag] || C.muted}20`, color: tagColors[ex.tag] || C.muted, fontWeight: 700 }}>{ex.tag}</span>
                          </div>
                          <div style={{ fontSize: 12, fontWeight: 600, color: C.text, lineHeight: 1.3 }}>{ex.name}</div>
                        </div>
                        <div style={{ textAlign: "right", marginLeft: 10 }}>
                          <div style={{ fontSize: 16, fontWeight: 700, color: d.color }}>{ex.sets}</div>
                          <div style={{ fontSize: 8, color: C.muted }}>series</div>
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: 14, marginTop: 6 }}>
                        <span style={{ fontSize: 10, color: C.text }}>{ex.reps} <span style={{ color: C.muted }}>reps</span></span>
                        {ex.rest !== "—" && <span style={{ fontSize: 10, color: C.text }}>{ex.rest} <span style={{ color: C.muted }}>descanso</span></span>}
                        <span style={{ fontSize: 9, color: C.dim, marginLeft: "auto" }}>{expandedEx === i ? "▲" : "▼"}</span>
                      </div>
                    </div>
                    {expandedEx === i && (
                      <div style={{ background: `${d.color}08`, border: `1px solid ${d.color}20`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "10px 14px" }}>
                        <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7 }}>💡 {ex.note}</div>
                        {ex.uni && (
                          <div style={{ marginTop: 8, padding: "7px 10px", background: `${C.purple}12`, border: `1px solid ${C.purple}25`, borderRadius: 6, fontSize: 10, color: C.purple, lineHeight: 1.6 }}>
                            📊 <b>Rastreo desbalance:</b> Anota el peso de cada lado. Si hay +10% de diferencia, el lado débil marca el peso de ambos.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Cardio */}
            {d.cardio && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginBottom: 12 }}>
                <div style={{ fontSize: 9, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>🏃 Cardio · Zona 2</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: C.text }}>{d.cardio.type}</div>
                <div style={{ fontSize: 12, color: d.color, fontWeight: 600, marginTop: 2 }}>{d.cardio.duration}</div>
                {d.cardio.detail && <div style={{ fontSize: 11, color: C.muted, marginTop: 4 }}>{d.cardio.detail}</div>}
                <div style={{ marginTop: 8, padding: "6px 10px", background: `${C.gold}10`, borderRadius: 6, fontSize: 10, color: C.gold }}>
                  Zona 2 = puedes hablar sin jadear. Si jadeas, baja la intensidad.
                </div>
              </div>
            )}

            {/* Rest day */}
            {d.id === 6 && (
              <div style={{ textAlign: "center", padding: "30px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 10 }}>😴</div>
                <div style={{ fontSize: 15, fontWeight: 700, color: C.text, marginBottom: 6 }}>Descanso Total</div>
                <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.7 }}>El músculo no crece en el gym — crece aquí.<br />Come tus proteínas, duerme 7h, relájate.</div>
              </div>
            )}

            {/* Volume summary */}
            {d.exercises.length > 0 && d.id < 5 && (
              <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: "10px 14px" }}>
                <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>Resumen</div>
                <div style={{ display: "flex", gap: 20 }}>
                  {[
                    { val: d.exercises.length, label: "ejercicios", color: d.color },
                    { val: d.exercises.reduce((a, e) => a + (parseInt(e.sets) || 0), 0), label: "series", color: d.color },
                    { val: d.exercises.filter(e => e.uni).length, label: "unilaterales", color: C.purple },
                  ].map(({ val, label, color }) => (
                    <div key={label}>
                      <div style={{ fontSize: 18, fontWeight: 700, color }}>{val}</div>
                      <div style={{ fontSize: 9, color: C.muted }}>{label}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ══════════ DIETA ══════════ */}
        {section === "dieta" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginBottom: 16 }}>
              {[
                { label: "Calorías", val: `~${totalCals}`, color: C.gold, note: "kcal/día" },
                { label: "Proteína", val: `~${totalProt}g`, color: C.coral, note: "vs 125g antes" },
                { label: "Déficit", val: `~${Math.round(deficit)}`, color: C.green, note: "kcal/día" },
              ].map(({ label, val, color, note }) => (
                <div key={label} style={{ background: `${color}12`, border: `1px solid ${color}25`, borderRadius: 10, padding: "10px", textAlign: "center" }}>
                  <div style={{ fontSize: 17, fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 9, color, marginTop: 2 }}>{label}</div>
                  <div style={{ fontSize: 9, color: C.muted }}>{note}</div>
                </div>
              ))}
            </div>

            <div style={{ fontSize: 9, color: C.muted, letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
              Plan — toca cada comida para ver detalle
            </div>

            {meals.map((m, i) => (
              <div key={i} style={{ marginBottom: 8 }}>
                <div onClick={() => setExpandedMeal(expandedMeal === i ? null : i)} style={{
                  background: C.card, border: `1px solid ${expandedMeal === i ? C.gold : C.border}`,
                  borderRadius: expandedMeal === i ? "10px 10px 0 0" : 10, padding: "13px 14px", cursor: "pointer",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 700, color: C.text }}>{m.name}</div>
                      <div style={{ fontSize: 10, color: C.muted, marginTop: 1 }}>{m.time} · <span style={{ color: C.green }}>{m.change}</span></div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: C.gold }}>{m.cals} kcal</div>
                      <div style={{ fontSize: 10, color: C.coral }}>{m.protein}g prot</div>
                    </div>
                  </div>
                  <div style={{ display: "flex", height: 5, borderRadius: 3, overflow: "hidden", marginTop: 8, gap: 1 }}>
                    <div style={{ flex: m.protein * 4, background: C.coral }} />
                    <div style={{ flex: m.carbs * 4, background: C.gold }} />
                    <div style={{ flex: m.fat * 9, background: C.green }} />
                  </div>
                  <div style={{ display: "flex", gap: 10, fontSize: 9, marginTop: 3 }}>
                    <span style={{ color: C.coral }}>P:{m.protein}g</span>
                    <span style={{ color: C.gold }}>C:{m.carbs}g</span>
                    <span style={{ color: C.green }}>G:{m.fat}g</span>
                    <span style={{ color: C.dim, marginLeft: "auto" }}>{expandedMeal === i ? "▲" : "▼"}</span>
                  </div>
                </div>
                {expandedMeal === i && (
                  <div style={{ background: `${C.gold}08`, border: `1px solid ${C.gold}20`, borderTop: "none", borderRadius: "0 0 10px 10px", padding: "10px 14px" }}>
                    <div style={{ fontSize: 11, color: C.text, marginBottom: 6, lineHeight: 1.6 }}><b style={{ color: C.gold }}>Alimentos:</b> {m.foods}</div>
                    <div style={{ fontSize: 11, color: C.green, lineHeight: 1.6 }}>💡 {m.tip}</div>
                  </div>
                )}
              </div>
            ))}

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginTop: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.purple, marginBottom: 10 }}>Swaps Clave</div>
              {[
                { from: "Yogurt normal", to: "Yogurt GRIEGO 0%", why: "+8–10g proteína, mismas calorías" },
                { from: "150g pollo", to: "180g pollo o pescado", why: "+8g proteína, +50 kcal" },
                { from: "3 claras", to: "4 claras en desayuno", why: "+4g proteína, +17 kcal" },
                { from: "Cardio HIIT", to: "Zona 2 steady-state", why: "Menos cortisol, más quema de grasa" },
              ].map(({ from, to, why }) => (
                <div key={from} style={{ display: "flex", gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.dim}` }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, color: C.red, textDecoration: "line-through" }}>{from}</div>
                    <div style={{ fontSize: 11, color: C.green, fontWeight: 600 }}>→ {to}</div>
                  </div>
                  <div style={{ fontSize: 10, color: C.muted, flex: 1, lineHeight: 1.4 }}>{why}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ══════════ PROGRESO ══════════ */}
        {section === "progreso" && (
          <div>
            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 16 }}>
              {[
                { label: "Racha actual", val: `${streak}🔥`, color: C.coral },
                { label: "Días completados", val: totalDaysLogged, color: C.green },
                { label: "Hoy", val: `${todayDone}/6`, color: todayDone >= 5 ? C.green : todayDone >= 3 ? C.gold : C.muted },
              ].map(({ label, val, color }) => (
                <div key={label} style={{ background: C.card, border: `1px solid ${color}30`, borderRadius: 10, padding: "12px 8px", textAlign: "center" }}>
                  <div style={{ fontSize: 20, fontWeight: 800, color }}>{val}</div>
                  <div style={{ fontSize: 9, color: C.muted, marginTop: 2 }}>{label}</div>
                </div>
              ))}
            </div>

            {/* Today checklist */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 16, marginBottom: 16 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 12, letterSpacing: 1 }}>
                ✅ Checklist de Hoy
              </div>
              {CHECKS.map(({ id, label }) => {
                const checked = todayChecks[id] || false;
                return (
                  <div
                    key={id}
                    onClick={() => toggleCheck(id)}
                    style={{
                      display: "flex", alignItems: "center", gap: 12,
                      padding: "11px 0", borderBottom: `1px solid ${C.dim}`,
                      cursor: "pointer", transition: "opacity 0.15s",
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: 6, flexShrink: 0,
                      background: checked ? C.green : "transparent",
                      border: `2px solid ${checked ? C.green : C.muted}`,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      transition: "all 0.2s",
                    }}>
                      {checked && <span style={{ fontSize: 12, color: C.bg, fontWeight: 800 }}>✓</span>}
                    </div>
                    <span style={{ fontSize: 13, color: checked ? C.text : C.muted, textDecoration: checked ? "none" : "none", flex: 1 }}>
                      {label}
                    </span>
                  </div>
                );
              })}
              {todayDone === 6 && (
                <div style={{ marginTop: 12, textAlign: "center", fontSize: 13, color: C.green, fontWeight: 700 }}>
                  🎉 ¡Día perfecto! Completaste todo.
                </div>
              )}
            </div>

            {/* Legend */}
            <div style={{ display: "flex", gap: 12, marginBottom: 10, flexWrap: "wrap" }}>
              {[
                { color: C.green, label: "5–6 ✓ Excelente" },
                { color: C.gold, label: "3–4 ✓ Bien" },
                { color: C.coral, label: "1–2 ✓ Parcial" },
                { color: C.dim, label: "0 ✓ Sin registro" },
              ].map(({ color, label }) => (
                <div key={label} style={{ display: "flex", alignItems: "center", gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: 2, background: color }} />
                  <span style={{ fontSize: 10, color: C.muted }}>{label}</span>
                </div>
              ))}
            </div>

            {/* Calendar grid — 120 days */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.text, marginBottom: 12 }}>
                📅 120 Días · 9 Mar → 6 Jul 2026
              </div>

              {/* Month labels */}
              {["Mar", "Abr", "May", "Jun", "Jul"].map((month, mi) => {
                const monthDays = calDays.filter(d2 => {
                  const m = d2.toLocaleString("es", { month: "short" });
                  return m.toLowerCase().startsWith(month.toLowerCase());
                });
                if (monthDays.length === 0) return null;
                return (
                  <div key={month} style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>
                      {month}
                    </div>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 4 }}>
                      {/* Day of week headers */}
                      {mi === 0 && ["L","M","X","J","V","S","D"].map(dw => (
                        <div key={dw} style={{ fontSize: 8, color: C.muted, textAlign: "center", paddingBottom: 4 }}>{dw}</div>
                      ))}
                      {/* Offset for first month */}
                      {mi === 0 && Array.from({ length: 0 }).map((_, i) => <div key={`off${i}`} />)}
                      {monthDays.map(date => {
                        const key = dateKey(date);
                        const isToday = key === todayKey;
                        const isFuture = date > new Date();
                        const color = getDayColor(key);
                        const dayNum = date.getDate();
                        return (
                          <div
                            key={key}
                            style={{
                              aspectRatio: "1",
                              borderRadius: 4,
                              background: color || (isFuture ? "transparent" : "#1a1a1a"),
                              border: isToday ? `2px solid ${C.gold}` : `1px solid ${isFuture ? C.dim : color || C.dim}`,
                              display: "flex", alignItems: "center", justifyContent: "center",
                              fontSize: 9, color: color ? C.bg : C.muted,
                              fontWeight: isToday ? 800 : 400,
                            }}
                          >
                            {dayNum}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ══════════ PROYECCIONES (metas) ══════════ */}
        {section === "metas" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: 6, marginBottom: 16 }}>
              {milestones.map(m => (
                <div key={m.label} style={{ background: C.card, border: `1px solid ${m.color}40`, borderRadius: 10, padding: "10px 6px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 2, background: m.color }} />
                  <div style={{ fontSize: 8, color: m.color, letterSpacing: 1, marginBottom: 4 }}>{m.label}</div>
                  <div style={{ fontSize: 14, fontWeight: 800, color: C.text }}>{m.weight}</div>
                  <div style={{ fontSize: 9, color: C.muted }}>kg</div>
                  <div style={{ fontSize: 11, color: m.color, fontWeight: 600, marginTop: 2 }}>{m.fatPct}%</div>
                  {m.days > 0 && <div style={{ fontSize: 8, color: C.muted, marginTop: 4 }}>−{m.fatLost}kg</div>}
                </div>
              ))}
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: C.gold, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>Peso (kg)</div>
              <ResponsiveContainer width="100%" height={160}>
                <AreaChart data={chartData.filter((_, i) => i % 3 === 0)}>
                  <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.gold} stopOpacity={0.25} /><stop offset="95%" stopColor={C.gold} stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={v => v === 0 ? "Hoy" : `D${v}`} ticks={[0, 30, 60, 90, 120]} />
                  <YAxis domain={[62, 71]} tick={{ fill: C.muted, fontSize: 10 }} />
                  <Tooltip contentStyle={{ background: C.bg, border: `1px solid ${C.gold}44`, borderRadius: 8, fontSize: 11 }} formatter={v => [`${v} kg`, "Peso"]} labelFormatter={l => `Día ${l}`} />
                  <Area type="monotone" dataKey="weight" stroke={C.gold} fill="url(#wg)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 14, marginBottom: 14 }}>
              <div style={{ fontSize: 10, color: C.teal, letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>% Grasa Corporal</div>
              <ResponsiveContainer width="100%" height={145}>
                <AreaChart data={chartData.filter((_, i) => i % 3 === 0)}>
                  <defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={C.teal} stopOpacity={0.25} /><stop offset="95%" stopColor={C.teal} stopOpacity={0} /></linearGradient></defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#ffffff08" />
                  <XAxis dataKey="day" tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={v => v === 0 ? "Hoy" : `D${v}`} ticks={[0, 30, 60, 90, 120]} />
                  <YAxis domain={[25, 34]} tick={{ fill: C.muted, fontSize: 10 }} tickFormatter={v => `${v}%`} />
                  <Tooltip contentStyle={{ background: C.bg, border: `1px solid ${C.teal}44`, borderRadius: 8, fontSize: 11 }} formatter={v => [`${v}%`, "% Grasa"]} labelFormatter={l => `Día ${l}`} />
                  <Area type="monotone" dataKey="fatPct" stroke={C.teal} fill="url(#fg)" strokeWidth={2} dot={false} />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div style={{ background: `${C.gold}10`, border: `1px solid ${C.gold}30`, borderRadius: 12, padding: 16 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: C.gold, marginBottom: 12 }}>🎯 Al día 120</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                {[
                  { label: "Peso", val: `~${project(120).weight} kg`, color: C.gold },
                  { label: "% Grasa", val: `~${project(120).fatPct}%`, color: C.teal },
                  { label: "Grasa perdida", val: `~${project(120).fatLost} kg`, color: C.coral },
                  { label: "Músculo ganado", val: `~${(project(120).muscleGained / 1000).toFixed(2)} kg`, color: C.purple },
                ].map(({ label, val, color }) => (
                  <div key={label}>
                    <div style={{ fontSize: 10, color: C.muted }}>{label}</div>
                    <div style={{ fontSize: 18, fontWeight: 800, color }}>{val}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ══════════ CORTISOL ══════════ */}
        {section === "cortisol" && (
          <div>
            <div style={{ background: `${C.purple}10`, border: `1px solid ${C.purple}30`, borderRadius: 12, padding: 14, marginBottom: 16 }}>
              <div style={{ fontWeight: 700, color: C.purple, fontSize: 13, marginBottom: 6 }}>🧠 Cortisol: el enemigo invisible</div>
              <div style={{ fontSize: 12, color: C.muted, lineHeight: 1.7 }}>
                El cortisol crónico acumula grasa exactamente en <b style={{ color: C.text }}>cintura, espalda y muslos</b> — tu distribución exacta. Bloquearlo es tan importante como la dieta.
              </div>
            </div>

            {cortisolTips.map(({ icon, title, detail, urgency, color }) => (
              <div key={title} style={{ background: C.card, border: `1px solid ${color}20`, borderRadius: 10, padding: 13, marginBottom: 8, display: "flex", gap: 10 }}>
                <span style={{ fontSize: 20, lineHeight: 1 }}>{icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                    <span style={{ fontWeight: 700, fontSize: 12, color: C.text }}>{title}</span>
                    <span style={{ fontSize: 7, padding: "2px 5px", borderRadius: 3, background: `${color}20`, color, fontWeight: 700, letterSpacing: 1, whiteSpace: "nowrap", marginLeft: 6 }}>{urgency}</span>
                  </div>
                  <div style={{ fontSize: 11, color: C.muted, lineHeight: 1.6 }}>{detail}</div>
                </div>
              </div>
            ))}

            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, padding: 14, marginTop: 6 }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: C.gold, marginBottom: 12 }}>💊 Stack Actualizado</div>
              {supplements.map(({ sup, dose, status, note, color }) => (
                <div key={sup} style={{ display: "flex", gap: 8, marginBottom: 10, paddingBottom: 10, borderBottom: `1px solid ${C.dim}` }}>
                  <div style={{ flex: 1.3 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>{sup}</div>
                    <div style={{ fontSize: 9, color: C.muted }}>{dose}</div>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 10, fontWeight: 700, color, marginBottom: 2 }}>{status}</div>
                    <div style={{ fontSize: 9, color: C.muted, lineHeight: 1.4 }}>{note}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── BOTTOM NAV ── */}
      <div style={{
        position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
        width: "100%", maxWidth: 430,
        background: "#0D0D0DDD", backdropFilter: "blur(12px)",
        borderTop: `1px solid ${C.border}`,
        display: "flex", justifyContent: "space-around", padding: "8px 0 10px",
        zIndex: 100,
      }}>
        {navItems.map(({ id, icon, label }) => (
          <button key={id} onClick={() => setSection(id)} style={{
            background: "none", border: "none", cursor: "pointer",
            display: "flex", flexDirection: "column", alignItems: "center", gap: 3,
            opacity: section === id ? 1 : 0.45, transition: "opacity 0.2s",
          }}>
            <span style={{ fontSize: 20 }}>{icon}</span>
            <span style={{ fontSize: 9, color: section === id ? C.gold : C.muted, fontWeight: section === id ? 700 : 400, letterSpacing: 0.5 }}>{label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
