// @ts-nocheck
import { customTicker, customTimers } from "../customGuard.ts";
const __mk = customTicker("VerificheSpecificheCandidatura");
const { setTimeout, setInterval, clearTimeout, clearInterval } = customTimers("VerificheSpecificheCandidatura");
import { useState } from "react";
import { Card, Select, TextInput, Badge, useTable } from "../floware";

export default function VerificheSpecificheCandidatura(props) {__mk();
  const table = useTable("candidature");
  const [scelta, setScelta] = useState("");
  const [schede, setSchede] = useState({});
  if (!table || table.column("Codice anonimo") < 0) return <p>Registro candidature non disponibile.</p>;
  const codici = table.rows.map(r => (__mk(), table.value(r, "Codice anonimo")));
  const codice = codici.includes(scelta) ? scelta : codici[0];
  if (!codice) return <p>Nessuna candidatura disponibile.</p>;
  const riga = table.findRows("Codice anonimo", codice)[0];
  const dati = schede[codice] || {};
  function cambia(campo, valore) {__mk();
    setSchede(prima => {__mk();
      const scheda = { ...(prima[codice] || {}) };
      scheda[campo] = valore;
      const nuove = { ...prima };
      nuove[codice] = scheda;
      return nuove;
    });
  }
  const ignoto = "Da verificare";
  const pec = dati.pec || ignoto;
  const legame = dati.legame || ignoto;
  const pecNo = pec === "Evidenza negativa" || legame === "Non corrisponde";
  const pecSi = pec === "Evidenza positiva" && legame === "Corrisponde";
  const pecEsito = pecNo ? "Non superato" : pecSi ? "Superato nella simulazione" : ignoto;
  const pecMotivo = pecNo ? "Le evidenze selezionate segnalano una casella non valida o non associata alla candidatura." : pecSi ? "Selezionate evidenze positive sulla validità e sull'associazione alla candidatura. Nessuna verifica esterna eseguita." : "Servono evidenze distinte sulla validità della casella e sul legame con la candidatura. La semplice menzione della PEC non basta.";
  const atteso = (dati.atteso || "").trim();
  const rilevato = (dati.rilevato || "").trim();
  const completo = atteso !== "" && rilevato !== "";
  const uguale = completo && atteso === rilevato;
  const pagamentoEsito = !completo ? ignoto : uguale ? "Superato nella simulazione" : "Non superato";
  const pagamentoMotivo = !completo ? "Manca il beneficiario previsto dal bando o quello della ricevuta." : uguale ? "Gli identificativi fittizi coincidono esattamente. Il confronto non autentica la ricevuta." : "Gli identificativi non coincidono: occorre chiarire la difformità. Denominazioni simili non sono equiparate automaticamente.";
  const titolo = dati.titolo || ignoto;
  const richiesto = dati.richiesto || ignoto;
  const universita = dati.universita || ignoto;
  const studioNo = titolo === "Non conforme" || (richiesto === "Sì" && universita === "Condizione non soddisfatta");
  const studioSi = titolo === "Conforme" && (richiesto === "No" || (richiesto === "Sì" && universita === "Attestato"));
  const studioEsito = studioNo ? "Non superato" : studioSi ? "Superato nella simulazione" : ignoto;
  const studioMotivo = studioNo ? "Il titolo non soddisfa il requisito puntuale o la condizione di accesso all'università richiesta dal bando." : studioSi ? "Conformità dichiarata dopo confronto documentale; la condizione di accesso all'università è attestata oppure non richiesta dal bando." : "Manca un confronto documentale completo con il requisito del bando, inclusa l'eventuale condizione di accesso all'università. Evidenza assente non significa requisito non soddisfatto.";
  return <Card title="Controlli specifici per candidatura">
    <div className="space-y-4 text-(--mk-text)">
      <p>Simulazione con dati inventati, conservati in memoria. Gli esiti sono indipendenti dalla lista sottostante: i suoi automatismi per parole chiave non costituiscono prova dei requisiti.</p>
      <Select label="Candidatura" value={codice} options={codici} onChange={setScelta} />
      <p>Concorso: {table.column("Concorso") >= 0 ? table.value(riga, "Concorso") : "Non disponibile"}</p>
      <Card title="PEC obbligatoria">
        <div className="space-y-3">
          <p>Non riportare indirizzi. Selezionare soltanto l'esito simulato dell'esame delle evidenze.</p>
          <Select label="Evidenza sulla validità della casella" value={pec} options={[ignoto, "Evidenza positiva", "Evidenza negativa"]} onChange={v => (__mk(), cambia("pec", v))} />
          <Select label="Associazione documentata alla candidatura" value={legame} options={[ignoto, "Corrisponde", "Non corrisponde"]} onChange={v => (__mk(), cambia("legame", v))} />
          <Badge>{pecEsito}</Badge><p>{pecMotivo}</p>
        </div>
      </Card>
      <Card title="Beneficiario della tassa">
        <div className="space-y-3">
          <p>Usare solo identificativi di enti inventati, ad esempio ENTE-DEMO-A. Il confronto è esatto.</p>
          <TextInput label="Beneficiario previsto dal bando: identificativo fittizio" value={dati.atteso || ""} onChange={v => (__mk(), cambia("atteso", v))} />
          <TextInput label="Beneficiario nella ricevuta: identificativo fittizio" value={dati.rilevato || ""} onChange={v => (__mk(), cambia("rilevato", v))} />
          <Badge>{pagamentoEsito}</Badge><p>{pagamentoMotivo}</p>
        </div>
      </Card>
      <Card title="Titolo di studio">
        <div className="space-y-3">
          <p>Confrontare tipo, livello, durata ed eventuali equipollenze con la clausola del bando. Le selezioni rappresentano una valutazione documentale simulata, non un riconoscimento automatico.</p>
          <Select label="Confronto puntuale titolo e requisito del bando" value={titolo} options={[ignoto, "Conforme", "Non conforme"]} onChange={v => (__mk(), cambia("titolo", v))} />
          <Select label="Il bando richiede un titolo che consenta l'accesso all'università?" value={richiesto} options={[ignoto, "Sì", "No"]} onChange={v => (__mk(), cambia("richiesto", v))} />
          {richiesto === "Sì" && <Select label="Condizione per il titolo dichiarato" value={universita} options={[ignoto, "Attestato", "Condizione non soddisfatta"]} onChange={v => (__mk(), cambia("universita", v))} />}
          <Badge>{studioEsito}</Badge><p>{studioMotivo}</p>
        </div>
      </Card>
      <p className="text-(--mk-muted)">La presenza di parole nel documento non supera alcun controllo del pannello. Nessun esito modifica automaticamente l'ammissione.</p>
    </div>
  </Card>;
}
