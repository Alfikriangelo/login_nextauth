import { auth, signIn, signOut } from "@/auth";

// Simpan user yang login dalam variabel global
const activeUsers = new Map(); // Map untuk menyimpan data user di server

export default async function SignIn() {
  const session = await auth();
  const user = session?.user;

  if (user) {
    // Tambahkan user ke dalam daftar jika belum ada
    if (!activeUsers.has(user.email)) {
      activeUsers.set(user.email, user);

      // Console log daftar user yang login
      console.log("Active Users:", Array.from(activeUsers.values()));
    }
  }

  return (
    <>
      {user ? (
        <>
          <h1 className="text-2xl">Welcome {user.name}</h1>

          {/* Tampilkan data user dalam format JSON */}
          <pre className="p-4  rounded-md">{JSON.stringify(user, null, 2)}</pre>

          {/* Tampilkan semua user yang login */}
          <h2 className="text-xl mt-4">Active Users:</h2>
          <pre className="p-4  rounded-md">
            {JSON.stringify(Array.from(activeUsers.values()), null, 2)}
          </pre>

          <form
            action={async () => {
              "use server";
              activeUsers.delete(user.email); // Hapus user saat logout
              console.log(`User ${user.email} logged out`);
              console.log(
                "Updated Active Users:",
                Array.from(activeUsers.values())
              );
              await signOut();
            }}
          >
            <button type="submit" className="p-2 border-2 bg-blue-400">
              Sign Out
            </button>
          </form>
        </>
      ) : (
        <>
          <h1 className="text-2xl">
            You are not authenticated. Click below to Sign In
          </h1>
          <form
            action={async () => {
              "use server";
              await signIn("google", { redirectTo: "/secret" });
            }}
          >
            <button type="submit" className="p-2 border-2 bg-blue-400">
              Sign In
            </button>
          </form>
        </>
      )}
    </>
  );
}
