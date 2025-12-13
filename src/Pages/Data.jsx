import { getDoc,setDoc,collection,doc } from "firebase/firestore";
import { useApp } from "../App";
import { auth,db } from "../Firebase";

export default async function GetJapaneseHolidays(year) {
    const url=`https://date.nager.at/api/v3/PublicHolidays/${year}/JP`;
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

export function getHourDifference(start,end,rest){
const [sH, sM] = start.split(":").map(Number);
  const [eH, eM] = end.split(":").map(Number);
  const startTime = sH * 60 + sM;
  const endTime = eH * 60 + eM;  
  let dif = (endTime - startTime);
  if (dif < 0) dif += 24 * 60;
  dif-=rest;
  const hours= dif / 60;
  return Number(hours.toFixed(1));
}
