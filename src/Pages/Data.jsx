export default async function GetJapaneseHolidays() {
    const url=`https://date.nager.at/api/v3/PublicHolidays/${new Date().getFullYear()}/JP`;
            const res=await fetch(url);
            const data=await res.json();
            return data;
} 

export function FormartDate(date){
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
}