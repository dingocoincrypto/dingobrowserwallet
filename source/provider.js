const PROVIDER_URL = "https://dbewp.twinkykms.com";

const get = async (link) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);
  return (
    await fetch(link, {
      withCredentials: true,
      method: "GET",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
      },
    })
  ).json();
};

const post = async (link, data) => {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), 5000);
  return (
    await fetch(link, {
      withCredentials: true,
      method: "POST",
      signal: controller.signal,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
  ).json();
};

const getUtxos = (address) => {
  return get(`${PROVIDER_URL}/utxos/${address}`);
};

const getMempool = (address) => {
  return get(`${PROVIDER_URL}/mempool/${address}`);
};

const sendRawTransaction = (hex) => {
  return post(`${PROVIDER_URL}/sendrawtransaction/`, { tx: hex });
};

export default {
  getUtxos,
  getMempool,
  sendRawTransaction
};
