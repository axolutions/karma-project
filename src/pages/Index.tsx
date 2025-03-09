import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import LoginForm from "@/components/LoginForm";
import ProfileForm from "@/components/ProfileForm";
import { getCurrentUser, isLoggedIn, getUserData, logout } from "@/lib/auth";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const Index = () => {
	const [userLoggedIn, setUserLoggedIn] = useState(false);
	const [hasProfile, setHasProfile] = useState(false);
	const [isLoading, setIsLoading] = useState(true);
	const navigate = useNavigate();
	const { toast } = useToast();

	useEffect(() => {
		const attemptUserLogin = async () => {
			try {
				const loggedIn = isLoggedIn();
				setUserLoggedIn(loggedIn);
				console.log("Index: Usuário logado?", loggedIn);
	
				if (loggedIn) {
					const email = getCurrentUser();
					if (email) {
						const userData = await getUserData(email);
						console.log("Index: Dados do usuário:", userData);
						if (userData && userData.name) {
							console.log("Usuário já tem perfil completo");
							setHasProfile(true);
						} else {
							console.log("Usuário logado, mas sem perfil");
							setHasProfile(false);
						}
					}
				} else {
					setHasProfile(false);
				}
			} catch (error) {
				console.error("Erro ao verificar login:", error);
			} finally {
				setIsLoading(false);
			}
		}

		attemptUserLogin();
	}, [navigate]);

	useEffect(() => {
		const handleStorageChange = () => {
			const isUserLoggedIn = isLoggedIn();
			if (userLoggedIn && !isUserLoggedIn) {
				setUserLoggedIn(false);
				setHasProfile(false);
				window.location.reload();
			}
		};

		window.addEventListener("storage", handleStorageChange);
		return () => {
			window.removeEventListener("storage", handleStorageChange);
		};
	}, [userLoggedIn]);

	const handleLogout = () => {
		logout();
		toast({
			title: "Logout realizado",
			description: "Você saiu do sistema com sucesso.",
		});
		setUserLoggedIn(false);
		setHasProfile(false);
		window.location.reload();
	};

	const handleAccessMatrix = () => {
		console.log("Acessando matriz...");
		navigate("/matrix");
	};

	if (isLoading) {
		return (
			<div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-white py-12 flex items-center justify-center">
				<div className="text-center">
					<div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#8B4513] border-r-transparent"></div>
					<p className="mt-4 text-[#8B4513]">Carregando...</p>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-b from-[#f5e6d3] to-white py-12 flex items-center justify-center">
			<div className="container max-w-5xl mx-auto px-4">
				{userLoggedIn && (
					<div className="flex justify-end mb-4">
						<Button
							onClick={handleLogout}
							variant="outline"
							className="bg-[#8B4513] text-white hover:bg-[#704214] border-none flex items-center"
						>
							<LogOut className="mr-2 h-4 w-4" />
							Sair
						</Button>
					</div>
				)}

				<motion.div
					initial={{ opacity: 0, y: 20 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.2, duration: 0.5 }}
					className="max-w-2xl mx-auto"
				>
					<h1 className="text-4xl md:text-5xl font-serif text-center text-[#8B4513] mb-12">
						Matriz Kármica 2025 🔮
					</h1>

					<div className="bg-white rounded-2xl p-8 shadow-lg">
						{userLoggedIn && !hasProfile ? (
							<ProfileForm />
						) : userLoggedIn && hasProfile ? (
							<div className="text-center">
								<p className="mb-6 text-[#8B4513]">
									Você já está logado e seu perfil está completo.
								</p>
								<button
									onClick={handleAccessMatrix}
									className="w-full py-3 px-6 bg-[#8B4513] text-white rounded-lg hover:bg-[#704214] transition-colors"
								>
									Acessar Minha Matriz Kármica
								</button>
							</div>
						) : (
							<div>
								<div className="text-center mb-6">
									<h2 className="text-2xl font-serif text-[#8B4513] mb-4">
										Faça Login para Acessar
									</h2>
									<p className="text-[#8B4513]">
										Entre com sua conta para visualizar sua matriz kármica
										pessoal.
									</p>
								</div>
								<LoginForm />
							</div>
						)}

						<div className="mt-6 pt-6 border-t border-[#e2d1c3] text-center">
							<p className="text-sm text-[#8B4513]">
								Adquira sua Matriz Kármica Pessoal 2025 e transforme sua jornada
								espiritual.
							</p>
						</div>
					</div>

					<div className="mt-8 text-center">
						<Link
							to="/admin"
							className="text-sm text-[#8B4513] hover:text-[#704214] underline"
						>
							Acesso Administrativo
						</Link>
					</div>
				</motion.div>
			</div>
		</div>
	);
};

export default Index;
