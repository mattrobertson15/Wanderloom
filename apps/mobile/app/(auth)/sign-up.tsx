import { Link } from "expo-router";
import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import { colors } from "@wanderloom/config";
import { OAuthButtons } from "@/components/oauth-buttons";
import { getMobileSupabaseClient } from "@/lib/supabase/client";

export default function SignUpScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSignUp() {
    setLoading(true);
    setError(null);
    const supabase = getMobileSupabaseClient();
    const { error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { username } },
    });
    setLoading(false);
    if (signUpError) setError(signUpError.message);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Start your map</Text>
      <TextInput style={styles.input} placeholder="Username" autoCapitalize="none" value={username} onChangeText={setUsername} />
      <TextInput
        style={styles.input}
        placeholder="Email"
        autoCapitalize="none"
        keyboardType="email-address"
        value={email}
        onChangeText={setEmail}
      />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry value={password} onChangeText={setPassword} />
      {error && <Text style={styles.error}>{error}</Text>}
      <Pressable style={styles.button} onPress={handleSignUp} disabled={loading}>
        <Text style={styles.buttonLabel}>{loading ? "Creating account…" : "Create account"}</Text>
      </Pressable>
      <OAuthButtons />
      <Link href="/sign-in" style={styles.link}>
        Already have an account? Sign in
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 24, backgroundColor: colors.background.base },
  title: { fontSize: 24, marginBottom: 24, color: colors.text.primary },
  input: {
    borderWidth: 1,
    borderColor: colors.text.secondary + "4D",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 12,
  },
  error: { color: "#DC2626", marginBottom: 8 },
  button: { backgroundColor: colors.accent.primary, borderRadius: 999, paddingVertical: 12, alignItems: "center" },
  buttonLabel: { color: "white", fontSize: 14, fontWeight: "600" },
  link: { marginTop: 24, textAlign: "center", color: colors.accent.primary },
});
