const padStart = (str, len, char) => {
  while (str.length < len) {
    str = char + str;
  }

  return str;
};

export const formatTime = (elapsedTime) => {
  let negative = elapsedTime < 0;

  if (negative) elapsedTime *= -1;

  // ==== Extract time components ====
  const elapsedMS = elapsedTime % 1000;
  elapsedTime = (elapsedTime - elapsedMS) / 1000;
  // Extract seconds
  const elapsedSeconds = elapsedTime % 60;
  elapsedTime = (elapsedTime - elapsedSeconds) / 60;
  // Extract minutes
  const elapsedMinutes = elapsedTime % 60;
  // Extract hours
  const elapsedHours = (elapsedTime - elapsedMinutes) / 60;

  //console.log(elapsedHours, elapsedMinutes, elapsedSeconds, elapsedMS);

  // ==== Generate displayed value ====
  let timeDisplay = "";

  if (elapsedHours > 0) {
    timeDisplay =
      elapsedHours +
      ":" +
      padStart(elapsedMinutes.toString(), 2, "0") +
      ":" +
      padStart(elapsedSeconds.toString(), 2, "0");
  } else if (elapsedMinutes > 0) {
    timeDisplay =
      elapsedMinutes.toString() +
      ":" +
      padStart(elapsedSeconds.toString(), 2, "0");
  } else {
    timeDisplay = elapsedSeconds.toString();
  }

  if (negative) {
    timeDisplay = "-" + timeDisplay;
  }

  const msDisplay = padStart(Math.floor(elapsedMS / 10).toString(), 2, "0");

  return [timeDisplay, msDisplay];
};
