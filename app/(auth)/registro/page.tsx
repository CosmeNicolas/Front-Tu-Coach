import { RegisterProfesorForm } from '@/components/auth/RegisterProfesorForm';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

export default function RegistroProfesorPage() {
  return (
    <div className="relative flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="absolute right-4 top-4 z-20 rounded-full border border-white/20 bg-black/30 p-1 backdrop-blur-md">
        <ThemeToggle variant="compact" className="text-white [&_svg]:text-white/90" />
      </div>
      <RegisterProfesorForm />
    </div>
  );
}
