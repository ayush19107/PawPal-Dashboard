export const getHealthInsights = async (pet: any, telemetry: any) => {

  const symptomsText = `
  Heart Rate: ${telemetry.heartRate} bpm
  Temperature: ${telemetry.temperature} °C
  Last Updated: ${telemetry.lastUpdated}
  `;

  const response = await fetch("http://localhost:5000/api/diagnose", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      pet,
      symptoms: symptomsText
    }),
  });

  if (!response.ok) {
    throw new Error("Diagnosis failed");
  }

  return response.json();
};
