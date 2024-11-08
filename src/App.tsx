import { useState, useEffect } from "react";
import { Play, Pause, RotateCcw, Settings, Dumbbell, Coffee } from "lucide-react";

//Componentes
import Footer from "./components/Footer.tsx";

//Manejo de iconos animados
import "boxicons/css/boxicons.min.css";

type TimerMode = "trabajo" | "descanso";

function App() {
    //El tiempo inicial de la app en segundos
    const [time, setTime] = useState(25 * 60);
    const [isActive, setIsActive] = useState(false);
    //Modo de funcionamiento Trabajo o Descanso
    const [mode, setMode] = useState<TimerMode>("trabajo");
    const [workTime, setWorkTime] = useState(25);
    const [breakTime, setBreakTime] = useState(5);
    const [showSettings, setShowSettings] = useState(false);

    useEffect(() => {
        let interval: number | undefined;

        if (isActive && time > 0) {
            //Empieza a correr el timer
            interval = setInterval(() => {
                setTime((prevTime) => prevTime - 1);
            }, 1000);
        } else if (time === 0) {
            //Culminación del período de tiempo
            const audio = new Audio("https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3");
            audio.play();
            setMode(mode === "trabajo" ? "descanso" : "trabajo");
            setTime((mode === "trabajo" ? breakTime : workTime) * 60);
        }
        //Limpiador del intervalo
        return () => clearInterval(interval);
    }, [isActive, time, mode, workTime, breakTime]);

    //Alterar el estado del reloj
    const toggleTimer = () => setIsActive(!isActive);

    //Resetea el timer
    const resetTimer = () => {
        setIsActive(false);
        setTime(workTime * 60);
        setMode("trabajo");
    };

    //Se establece el formáto del tiempo en mm:ss
    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    //Obtención del porcentaje de tiempo transcurrido para mostrar en el slider indicador
    const progress = ((mode === "trabajo" ? workTime * 60 - time : breakTime * 60 - time) / (mode === "trabajo" ? workTime * 60 : breakTime * 60)) * 100;

    return (
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-[#000000] bg-[radial-gradient(#ffffff33_1px,#00091d_1px)] bg-[size:20px_20px]">
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="max-w-md w-full animate-float">
                    <div className="glass-card rounded-3xl p-8 border border-white/10 relative overflow-hidden">
                        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500"></div>

                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">Pomodora</h1>
                            <button onClick={() => setShowSettings(!showSettings)} className="relative text-white/80 hover:text-white transition-all duration-300 hover:rotate-90 transform">
                                <Settings className="w-6 h-6" />
                            </button>
                        </div>

                        {showSettings ? (
                            <div className="space-y-4 mb-6 animate-fade-in">
                                <div className="flex justify-between items-center">
                                    <label className="text-white flex items-center gap-2">
                                        <Dumbbell className="w-6 h-6" /> Tiempo de trabajo (minutos):
                                    </label>
                                    <input
                                        type="number"
                                        value={workTime}
                                        onChange={(e) => setWorkTime(Number(e.target.value))}
                                        className="w-20 bg-white/5 rounded-lg px-3 py-2 text-white border border-white/10 focus:border-violet-400/50 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="flex justify-between items-center">
                                    <label className="text-white flex items-center gap-2">
                                        <Coffee className="w-6 h-6" /> Tiempo de descanso (minutos):
                                    </label>
                                    <input
                                        type="number"
                                        value={breakTime}
                                        onChange={(e) => setBreakTime(Number(e.target.value))}
                                        className="w-20 bg-white/5 rounded-lg px-3 py-2 text-white border border-white/10 focus:border-violet-400/50 focus:outline-none transition-colors"
                                    />
                                </div>
                            </div>
                        ) : null}

                        <div className="relative">
                            <div className="w-full h-3 bg-white/5 rounded-full overflow-hidden mb-8 border border-white/10">
                                <div className="h-full bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 transition-all duration-1000 ease-in-out" style={{ width: `${progress}%` }} />
                            </div>

                            <div className="flex items-center justify-center mb-8">
                                <div className="relative">
                                    <div className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-white/80 mb-2 text-center tabular-nums">{formatTime(time)}</div>
                                    <div className="absolute -top-4 right-0 transform translate-x-full">
                                        {mode === "trabajo" ? (
                                            <i className={`bx bx-glasses-alt bx-lg ${isActive ? "bx-tada" : ""}`} style={{ color: "#fff" }}></i>
                                        ) : (
                                            <div className="relative text-fuchsia-400">
                                                <i className={`bx bx-coffee bx-lg ${isActive ? "bx-tada" : ""}`} style={{ color: "#fff" }}></i>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-6">
                                <button
                                    onClick={toggleTimer}
                                    className="relative bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-white rounded-full p-4 transition-all duration-300 transform hover:scale-110 border border-white/10 hover:border-white/20 group"
                                >
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                    {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                                </button>
                                <button
                                    onClick={resetTimer}
                                    className="relative bg-gradient-to-r from-violet-500/10 to-fuchsia-500/10 text-white rounded-full p-4 transition-all duration-300 transform hover:scale-110 border border-white/10 hover:border-white/20 group"
                                >
                                    <div className="absolute inset-0 rounded-full bg-gradient-to-r from-violet-500 to-fuchsia-500 opacity-0 group-hover:opacity-20 transition-opacity"></div>
                                    <RotateCcw className="w-8 h-8" />
                                </button>
                            </div>
                        </div>
                        <div className="mt-8 text-center">
                            <p className="text-white/80 text-xl font-medium">
                                {mode === "trabajo" ? (isActive ? "Momento de trabajo en curso" : "Presione PLAY para comenzar el trabajo") : isActive ? "Momento de descanso en curso..." : "Continuar con el momento de descanso"}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default App;
