import { TRANSCRIPT_RETENTION_DAYS } from '@/lib/voice-agent'
import type { Privacy } from './cs'

/** The privacy notice (GDPR art. 13) in German. Same sections and blocks as the Czech one (cs.ts). */
export const de: Privacy = {
  metaTitle: 'Datenschutzerklärung',
  metaDescription:
    'Welche Daten die Website von IndiWeb verarbeitet, zu welchem Zweck, wie lange und welche Rechte Sie haben.',
  eyebrow: 'Rechtliche Hinweise',
  title: 'Datenschutzerklärung',
  effective: 'Gültig ab {date}',
  updated: '6. Oktober 2026',
  authority:
    'Wenn Sie der Ansicht sind, dass wir mit Ihren Daten nicht im Einklang mit den Vorschriften umgehen, können Sie Beschwerde bei der Aufsichtsbehörde einlegen: Amt für den Schutz personenbezogener Daten (Úřad pro ochranu osobních údajů, ÚOOÚ), Pplk. Sochora 27, 170 00 Praha 7,',
  authorityAfter: '.',
  intro:
    'Auf dieser Seite erfahren Sie, welche Daten wir beim Besuch der Website von IndiWeb über Sie verarbeiten, zu welchem Zweck, wie lange und welche Rechte Sie haben. Wir bemühen uns, nur das zu erheben, was wir wirklich benötigen.',
  sections: [
    {
      title: 'Wer Ihre Daten verarbeitet',
      body: [
        {
          p: 'Verantwortlicher für die Verarbeitung personenbezogener Daten ist Denis Mitrović, der die Website von IndiWeb gemeinsam mit Adam und Ondra betreibt. Mit allen Anliegen zu Ihren Daten können Sie sich an folgende E-Mail-Adresse wenden:',
        },
        { contact: true },
      ],
    },
    {
      title: 'Anfrageformular',
      body: [
        {
          p: 'Wenn Sie uns eine Anfrage senden, verarbeiten wir Ihren Namen, Ihre E-Mail-Adresse, die gewählte Leistung und den Text Ihrer Nachricht, um Ihnen antworten und ein Angebot erstellen zu können. Rechtsgrundlage ist die Durchführung vorvertraglicher Maßnahmen auf Ihre Anfrage hin (Art. 6 Abs. 1 lit. b DSGVO).',
        },
        {
          p: 'Die Nachricht erreicht uns per E-Mail über den Dienst Resend und wird in einem Gmail-Postfach (Google) gespeichert. Kommt keine Zusammenarbeit zustande, löschen wir die Anfrage spätestens nach 12 Monaten.',
        },
      ],
    },
    {
      title: 'Sprachdemo von Aria',
      body: [
        {
          p: 'Das Gespräch mit Aria starten Sie selbst über die Schaltfläche „Mit Aria sprechen“. Ihre Stimme wird in Echtzeit vom Dienst ElevenLabs verarbeitet, der sie in Text umwandelt und mithilfe eines Sprachmodells Arias Antwort erzeugt. Rechtsgrundlage ist Ihre Einwilligung, die Sie mit dem Start des Gesprächs erteilen (Art. 6 Abs. 1 lit. a DSGVO). Sie können das Gespräch jederzeit beenden.',
        },
        {
          p: `Eine Tonaufnahme Ihrer Stimme wird nicht gespeichert. Das Transkript des Gesprächs wird bei ElevenLabs ${TRANSCRIPT_RETENTION_DAYS} Tage lang aufbewahrt, damit wir sehen, wonach Besucher fragen, und anschließend automatisch gelöscht. Bitte nennen Sie im Gespräch keine sensiblen Daten.`,
        },
      ],
    },
    {
      title: '3D-Rundgang (Splatoo)',
      body: [
        {
          p: 'Der Bereich mit dem 3D-Rundgang zeigt Inhalte des Dienstes Splatoo und wird erst geladen, wenn Sie auf der Seite dorthin scrollen. Splatoo erhält dabei technische Daten über Ihren Browser, zum Beispiel die IP-Adresse. Eine Reichweitenmessung des Rundgangs erfolgt nur mit Ihrer Einwilligung, die Sie in der Leiste direkt im Rundgang erteilen; dafür ist der Betreiber von Splatoo verantwortlich.',
        },
      ],
    },
    {
      title: 'Betrieb der Website und Cookies',
      body: [
        {
          p: 'Die Website wird bei Vercel gehostet. Vercel verarbeitet bei jedem Besuch technische Daten (IP-Adresse, Browsertyp, Zeitpunkt), um einen sicheren und zuverlässigen Betrieb zu gewährleisten. Rechtsgrundlage ist unser berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).',
        },
        {
          p: 'Die Reichweite messen wir mit Vercel Web Analytics, um zu wissen, wie viele Menschen die Website besuchen und welche Seiten sie lesen. Das Tool verwendet keine Cookies und verfolgt Sie nicht über mehrere Websites hinweg; die Ergebnisse sehen wir nur als zusammengefasste Zahlen, nicht nach einzelnen Besuchern. Rechtsgrundlage ist unser berechtigtes Interesse (Art. 6 Abs. 1 lit. f DSGVO).',
        },
        {
          p: 'Wir selbst setzen weder Cookies noch Werbetools ein. Ihr Browser merkt sich lediglich für die Dauer des Besuchs, dass Sie die Eingangsanimation bereits gesehen haben, damit sie nicht erneut abgespielt wird.',
        },
      ],
    },
    {
      title: 'Wer sonst Zugriff auf die Daten hat',
      body: [
        {
          list: [
            'Vercel Inc. (USA) – Hosting der Website und Reichweitenmessung',
            'Resend, Inc. (USA) – Zustellung der E-Mail aus dem Formular',
            'Google LLC (USA) – E-Mail-Postfach Gmail',
            'Eleven Labs Inc. (USA) – Sprachdemo von Aria',
            'Splatoo – 3D-Rundgang (eigenständiger Verantwortlicher)',
          ],
        },
        {
          p: 'Die Daten können dadurch in ein Land außerhalb der EU gelangen, nämlich in die USA. Dies geschieht auf Grundlage des EU-US-Datenschutzrahmens (Data Privacy Framework) oder der von der Europäischen Kommission genehmigten Standardvertragsklauseln. Wir verkaufen Ihre Daten an niemanden.',
        },
      ],
    },
    {
      title: 'Ihre Rechte',
      body: [
        {
          list: [
            'zu erfahren, welche Daten wir über Sie haben, und eine Kopie davon zu erhalten',
            'unrichtige Daten berichtigen zu lassen',
            'Daten löschen oder ihre Verarbeitung einschränken zu lassen',
            'Widerspruch gegen die Verarbeitung auf Grundlage eines berechtigten Interesses einzulegen',
            'Ihre Daten in einem maschinenlesbaren Format zu erhalten',
            'Ihre Einwilligung jederzeit zu widerrufen, ohne dass die Rechtmäßigkeit der bis zum Widerruf erfolgten Verarbeitung berührt wird',
          ],
        },
        {
          p: 'Schreiben Sie uns dazu einfach an die oben genannte E-Mail-Adresse. Wir antworten spätestens innerhalb eines Monats.',
        },
      ],
    },
    {
      title: 'Beschwerde bei der Aufsichtsbehörde',
      body: [{ authority: true }],
    },
  ],
}
