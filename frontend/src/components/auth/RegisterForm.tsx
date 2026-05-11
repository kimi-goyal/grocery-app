interface Props {
  onSwitch?: () => void;
}

const RegisterForm = ({ onSwitch }: Props) => {
  return (
    <div>
      <div className="mb-8">
        <h2 className="text-4xl font-bold">Create Account</h2>

        <p className="text-gray-400 mt-3">
          Join us and order groceries faster than ever.
        </p>
      </div>

      <form className="space-y-5">
        <input
          type="text"
          placeholder="Full Name"
          className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
        />

        <input
          type="email"
          placeholder="Email Address"
          className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
        />

        <input
          type="password"
          placeholder="Create Password"
          className="w-full bg-[#0f172a] border border-white/10 rounded-xl px-4 py-4 outline-none focus:border-[#ff4d6d]"
        />

        <button
          type="submit"
          className="w-full bg-[#ff4d6d] hover:bg-[#ff355d] transition-all py-4 rounded-xl font-semibold"
        >
          Create Account
        </button>
      </form>

      <p className="text-center text-gray-400 mt-8">
        Already have an account?

        <button
          type="button"
          onClick={() => onSwitch?.()}
          className="text-[#ff4d6d] ml-2 font-semibold"
        >
          Login
        </button>
      </p>
    </div>
  )
}

export default RegisterForm
