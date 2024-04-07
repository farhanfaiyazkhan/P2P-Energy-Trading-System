import axios from "axios";

export const buyNodeRed = async (_time) => {
    const res = await axios.post("/buy", {time: _time});
    if(res.status !== 200) {
        throw new Error("Energy transfer failed");
    }
    const data = await res.data;
    return data;
}