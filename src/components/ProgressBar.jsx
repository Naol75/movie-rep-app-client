import "../styles/ProgressBar.css";

function ProgressBar({ percent }) {
  const radius = 0.2 * Math.min(window.innerWidth, window.innerHeight);
  const borderWidth = 0.03 * radius;

  const outerCircumference = 2 * Math.PI * (radius + borderWidth / 2);

  const barLength = (percent / 100) * outerCircumference;

  return (
    <div className="percent">
      <svg viewBox={`0 0 ${radius * 2} ${radius * 2}`}>
        <circle cx={radius} cy={radius} r={radius + borderWidth / 2} fill="rgb(66, 66, 66)" stroke="#ccc" strokeWidth={5.75 * borderWidth} />
        <circle cx={radius} cy={radius} r={radius} fill="none" stroke="#00d312" strokeWidth={0.2 * radius} strokeLinecap="round"
          strokeDasharray={outerCircumference}
          strokeDashoffset={outerCircumference - barLength} 
        />
        <text x="50%" y="50%" dominantBaseline="middle" textAnchor="middle" fontSize={0.6 * radius} fill="white">{Math.round(percent)}%</text>
      </svg>
    </div>
  );
}

export default ProgressBar;