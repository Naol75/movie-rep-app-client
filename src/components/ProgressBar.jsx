import "../styles/ProgressBar.css";

function ProgressBar({ percent }) {
  // Calculamos la longitud de la circunferencia del círculo
  const radius = 0.2 * Math.min(window.innerWidth, window.innerHeight); // Nuevo radio del círculo basado en el tamaño de la ventana
  const borderWidth = 0.03 * radius; // Ancho del borde proporcional al radio

  // Calculamos la longitud de la circunferencia del círculo exterior
  const outerCircumference = 2 * Math.PI * (radius + borderWidth / 2);

  // Calculamos el largo de la barra de progreso en función del porcentaje
  const barLength = (percent / 100) * outerCircumference;

  return (
    <div className="percent">
      <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`}> {/* Usamos viewBox para hacer el SVG responsive */}
        {/* Círculo de fondo con borde */}
        <circle cx={radius} cy={radius} r={radius + borderWidth / 2} fill="rgb(66, 66, 66)" stroke="#ccc" strokeWidth={5.75 * borderWidth} />

        {/* Círculo de progreso */}
        <circle cx={radius} cy={radius} r={radius} fill="none" stroke="#00d312" strokeWidth={0.2 * radius} strokeLinecap="round"
          strokeDasharray={outerCircumference}
          strokeDashoffset={outerCircumference - barLength} 
        />

        {/* Número de porcentaje */}
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={0.6 * radius} fill="white">{Math.round(percent)}%</text>
      </svg>
    </div>
  );
}

export default ProgressBar;