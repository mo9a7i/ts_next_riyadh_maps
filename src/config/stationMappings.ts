interface StationInfo {
    id: string;
    name: {
        ar: string;
        en?: string;  // Optional English name for future use
    };
    line: string;
}

export const stationMappings: { [key: string]: StationInfo } = {
    // Blue Line (Line 1)
    "1Y1": { id: "1Y1", name: { ar: "الدار البيضاء" }, line: "1" },
    "1Z1": { id: "1Z1", name: { ar: "العزيزية" }, line: "1" },
    "1A2": { id: "1A2", name: { ar: "مركز النقل العام" }, line: "1" },
    "1B1": { id: "1B1", name: { ar: "مستشفى الإيمان" }, line: "1" },
    "1B2": { id: "1B2", name: { ar: "منفوحة" }, line: "1" },
    "1B3": { id: "1B3", name: { ar: "سكيرنة" }, line: "1" },
    "1B4": { id: "1B4", name: { ar: "العود" }, line: "1" },
    "1C1": { id: "1C1", name: { ar: "قصر الحكم" }, line: "1" },
    "1C2": { id: "1C2", name: { ar: "البطحاء" }, line: "1" },
    "1C3": { id: "1C3", name: { ar: "المتحف الوطني" }, line: "1" },
    "1C4": { id: "1C4", name: { ar: "الجوازات" }, line: "1" },
    "1D2": { id: "1D2", name: { ar: "المربع" }, line: "1" },
    "1D5": { id: "1D5", name: { ar: "وزارة الداخلية" }, line: "1" },
    "1E2": { id: "1E2", name: { ar: "مكتبة الملك فهد" }, line: "1" },
    "1F1": { id: "1F1", name: { ar: "بنك البلاد" }, line: "1" },
    "1F4": { id: "1F4", name: { ar: "مصرف الإنماء" }, line: "1" },
    "1F5": { id: "1F5", name: { ar: "العروبة" }, line: "1" },
    "1F7": { id: "1F7", name: { ar: "الورود 2" }, line: "1" },
    "1F8": { id: "1F8", name: { ar: "STC" }, line: "1" },
    "1F9": { id: "1F9", name: { ar: "حي الملك فهد 2" }, line: "1" },
    "1G1": { id: "1G1", name: { ar: "حي الملك فهد" }, line: "1" },
    "1G2": { id: "1G2", name: { ar: "المروج" }, line: "1" },
    "1H2": { id: "1H2", name: { ar: "المركز المالي" }, line: "1" },
    "1J1": { id: "1J1", name: { ar: "د. سمليان الحبيب" }, line: "1" },
    "1J2": { id: "1J2", name: { ar: "الأول" }, line: "1" }
};

export const getStationInfo = (stationId: string): StationInfo | null => {
    return stationMappings[stationId] || null;
}; 