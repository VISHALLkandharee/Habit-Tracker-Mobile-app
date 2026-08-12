import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import { useHabits } from "../../src/context/HabitContext";
import { InputField } from "../../src/components/InputField";
import { useRouter, useLocalSearchParams } from "expo-router";
import { COLORS, SHADOWS, GRADIENTS } from "../../src/constants/Config";
import { showAlert } from "../../src/utils/ui";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import DateTimePicker from "@react-native-community/datetimepicker";

// ─── Preset data (kept in sync with add.tsx) ────────────────────────────────
const HABIT_COLORS = [
  "#6366f1", "#f59e0b", "#10b981", "#ef4444",
  "#3b82f6", "#8b5cf6", "#ec4899", "#14b8a6",
];

const HABIT_ICONS = [
  { name: "flame-outline",         label: "Fitness"  },
  { name: "book-outline",          label: "Reading"  },
  { name: "water-outline",         label: "Hydration" },
  { name: "moon-outline",          label: "Sleep"    },
  { name: "barbell-outline",       label: "Gym"      },
  { name: "leaf-outline",          label: "Nature"   },
  { name: "brush-outline",         label: "Art"      },
  { name: "musical-notes-outline", label: "Music"    },
  { name: "code-slash-outline",    label: "Coding"   },
  { name: "heart-outline",         label: "Wellness" },
  { name: "walk-outline",          label: "Walking"  },
  { name: "star-outline",          label: "Goals"    },
];

const WEEK_DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function EditHabit() {
  const { id }             = useLocalSearchParams();
  const { habits, editHabit } = useHabits();
  const router             = useRouter();

  const [title, setTitle]               = useState("");
  const [description, setDescription]   = useState("");
  const [reminderDate, setReminderDate] = useState(
    new Date(new Date().setHours(8, 0, 0, 0))
  );
  const [showPicker, setShowPicker]       = useState(false);
  const [frequency, setFrequency]         = useState<"daily" | "weekly" | "custom">("daily");
  const [targetDays, setTargetDays]       = useState<string[]>([]);
  const [category, setCategory]           = useState("Health");
  const [selectedColor, setSelectedColor] = useState(HABIT_COLORS[0]);
  const [selectedIcon, setSelectedIcon]   = useState(HABIT_ICONS[0].name);
  const [isSubmitting, setIsSubmitting]   = useState(false);
  const [isLoaded, setIsLoaded]           = useState(false);

  // Pre-fill form from existing habit data
  useEffect(() => {
    if (!id) return;
    const habit = habits.find(h => h._id === id);
    if (habit) {
      setTitle(habit.title);
      setDescription(habit.description || "");
      if (habit.reminderTime) {
        const [hourStr, minuteStr] = habit.reminderTime.split(":");
        const hour   = parseInt(hourStr, 10);
        const minute = parseInt(minuteStr, 10);
        if (!isNaN(hour) && !isNaN(minute)) {
          setReminderDate(new Date(new Date().setHours(hour, minute, 0, 0)));
        }
      }
      if (habit.frequency)   setFrequency(habit.frequency);
      if (habit.targetDays)  setTargetDays(habit.targetDays);
      if (habit.category)    setCategory(habit.category);
      if (habit.color && HABIT_COLORS.includes(habit.color)) {
        setSelectedColor(habit.color);
      } else if (habit.color) {
        setSelectedColor(habit.color); // still apply even if not in preset list
      }
      if (habit.icon)        setSelectedIcon(habit.icon);
      setIsLoaded(true);
    } else {
      showAlert("Error", "Habit not found");
      router.back();
    }
  }, [id, habits]);

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS === "android") setShowPicker(false);
    if (selectedDate) setReminderDate(selectedDate);
  };

  const toggleDay = (day: string) => {
    setTargetDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    );
  };

  const handleSave = async () => {
    if (title.length < 3) {
      return showAlert("Short Title", "Give your habit a meaningful name (at least 3 chars).");
    }
    if (frequency === "custom" && targetDays.length === 0) {
      return showAlert("Pick Days", "Select at least one day for your custom schedule.");
    }

    setIsSubmitting(true);
    const hours   = reminderDate.getHours().toString().padStart(2, "0");
    const minutes = reminderDate.getMinutes().toString().padStart(2, "0");
    const payload = {
      title,
      description,
      reminderTime: `${hours}:${minutes}`,
      frequency,
      targetDays:   frequency === "custom" ? targetDays : [],
      category,
      color:        selectedColor,
      icon:         selectedIcon,
    };

    // Navigate immediately — editHabit does optimistic update, rolls back on failure
    router.back();

    try {
      await editHabit(id as string, payload);
    } catch (error: any) {
      const responseData     = error.response?.data;
      const validationErrors = responseData?.errors;
      let errorMessage       = "Could not update habit. Try again.";
      if (validationErrors?.length > 0) {
        errorMessage = validationErrors[0].message;
      } else if (responseData?.message) {
        errorMessage = responseData.message;
      }
      showAlert("Update Failed", errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayTime = `${reminderDate.getHours().toString().padStart(2, "0")}:${reminderDate
    .getMinutes()
    .toString()
    .padStart(2, "0")}`;

  if (!isLoaded) {
    return (
      <View style={[styles.container, { justifyContent: "center", alignItems: "center" }]}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Habit</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* ── Basic Info ──────────────────────────────────────────── */}
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>WHAT'S THE GOAL?</Text>
          <InputField
            label="Habit Name"
            placeholder="e.g. Morning Meditation"
            value={title}
            onChangeText={setTitle}
            containerStyle={styles.input}
          />
          <InputField
            label="Why this habit?"
            placeholder="e.g. To start the day with clarity"
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
            containerStyle={styles.input}
          />
        </View>

        {/* ── Appearance ──────────────────────────────────────────── */}
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>APPEARANCE</Text>

          <Text style={styles.subLabel}>Color</Text>
          <View style={styles.colorRow}>
            {HABIT_COLORS.map(color => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                style={[
                  styles.colorDot,
                  { backgroundColor: color },
                  selectedColor === color && styles.colorDotSelected,
                ]}
              >
                {selectedColor === color && (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                )}
              </TouchableOpacity>
            ))}
          </View>

          <Text style={[styles.subLabel, { marginTop: 16 }]}>Icon</Text>
          <View style={styles.iconGrid}>
            {HABIT_ICONS.map(item => (
              <TouchableOpacity
                key={item.name}
                onPress={() => setSelectedIcon(item.name)}
                style={[
                  styles.iconBtn,
                  selectedIcon === item.name && {
                    backgroundColor: selectedColor + "22",
                    borderColor: selectedColor,
                  },
                ]}
              >
                <Ionicons
                  name={item.name as any}
                  size={22}
                  color={selectedIcon === item.name ? selectedColor : COLORS.gray}
                />
                <Text
                  style={[
                    styles.iconLabel,
                    selectedIcon === item.name && { color: selectedColor },
                  ]}
                >
                  {item.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── Schedule ────────────────────────────────────────────── */}
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>SCHEDULE</Text>

          <Text style={styles.subLabel}>Frequency</Text>
          <View style={styles.frequencyContainer}>
            {(["daily", "weekly", "custom"] as const).map(f => (
              <TouchableOpacity
                key={f}
                style={[
                  styles.freqBtn,
                  frequency === f && { backgroundColor: selectedColor, borderColor: selectedColor },
                ]}
                onPress={() => setFrequency(f)}
              >
                <Text style={[styles.freqBtnText, frequency === f && styles.freqBtnTextActive]}>
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          {frequency === "custom" && (
            <>
              <Text style={styles.subLabel}>Pick Days</Text>
              <View style={styles.dayRow}>
                {WEEK_DAYS.map(day => {
                  const selected = targetDays.includes(day);
                  return (
                    <TouchableOpacity
                      key={day}
                      onPress={() => toggleDay(day)}
                      style={[
                        styles.dayBtn,
                        selected && { backgroundColor: selectedColor, borderColor: selectedColor },
                      ]}
                    >
                      <Text style={[styles.dayBtnText, selected && { color: "#fff" }]}>
                        {day}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </>
          )}

          <Text style={[styles.subLabel, { marginTop: 16 }]}>Reminder Time</Text>
          <TouchableOpacity
            style={[styles.timePickerContainer, { backgroundColor: selectedColor + "12" }]}
            activeOpacity={0.7}
            onPress={() => setShowPicker(true)}
          >
            <Ionicons name="notifications-outline" size={24} color={selectedColor} />
            <Text style={[styles.timeText, { color: selectedColor }]}>{displayTime}</Text>
          </TouchableOpacity>

          {(showPicker || Platform.OS === "ios") && (
            <DateTimePicker
              value={reminderDate}
              mode="time"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={handleTimeChange}
              style={{ alignSelf: "center", marginTop: 10 }}
            />
          )}
        </View>

        {/* ── Category ────────────────────────────────────────────── */}
        <View style={styles.formCard}>
          <Text style={styles.sectionLabel}>CATEGORY / STACK</Text>
          <InputField
            label="Stack Name"
            placeholder="e.g. Health, Morning, Work"
            value={category}
            onChangeText={setCategory}
            containerStyle={styles.input}
          />
        </View>

        {/* Save */}
        <TouchableOpacity
          activeOpacity={0.9}
          style={[styles.saveBtn, isSubmitting && styles.disabledBtn]}
          onPress={handleSave}
          disabled={isSubmitting}
        >
          <LinearGradient
            colors={[selectedColor, selectedColor + "CC"] as any}
            style={styles.saveGradient}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text style={styles.saveText}>Save Changes</Text>
                <Ionicons name="checkmark-circle-outline" size={20} color="#fff" />
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <View style={{ height: 60 }} />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container:     { flex: 1, backgroundColor: COLORS.background },
  scrollContent: { padding: 24, paddingTop: Platform.OS === "ios" ? 60 : 40 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#fff", justifyContent: "center",
    alignItems: "center", ...SHADOWS.sm,
  },
  headerTitle: { fontSize: 22, fontWeight: "bold", color: COLORS.text },
  formCard: {
    backgroundColor: "#fff", borderRadius: 24,
    padding: 20, marginBottom: 16, ...SHADOWS.sm,
  },
  sectionLabel: {
    fontSize: 12, fontWeight: "800", color: COLORS.gray,
    letterSpacing: 1, marginBottom: 16,
  },
  subLabel: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary, marginBottom: 10 },
  input: { marginBottom: 16 },
  colorRow: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  colorDot: {
    width: 34, height: 34, borderRadius: 17,
    justifyContent: "center", alignItems: "center",
  },
  colorDotSelected: { borderWidth: 3, borderColor: "#fff", ...SHADOWS.sm },
  iconGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  iconBtn: {
    alignItems: "center", justifyContent: "center",
    width: 62, paddingVertical: 10, borderRadius: 14,
    backgroundColor: COLORS.background, borderWidth: 1.5,
    borderColor: COLORS.border, gap: 4,
  },
  iconLabel: { fontSize: 10, fontWeight: "600", color: COLORS.gray, textAlign: "center" },
  frequencyContainer: { flexDirection: "row", gap: 8, marginBottom: 16 },
  freqBtn: {
    flex: 1, paddingVertical: 12, borderRadius: 12,
    backgroundColor: COLORS.background, alignItems: "center",
    borderWidth: 1.5, borderColor: COLORS.border,
  },
  freqBtnText: { fontSize: 14, fontWeight: "600", color: COLORS.textSecondary },
  freqBtnTextActive: { color: "#fff" },
  dayRow: { flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 8 },
  dayBtn: {
    paddingHorizontal: 12, paddingVertical: 8,
    borderRadius: 10, borderWidth: 1.5,
    borderColor: COLORS.border, backgroundColor: COLORS.background,
  },
  dayBtnText: { fontSize: 13, fontWeight: "700", color: COLORS.textSecondary },
  timePickerContainer: {
    flexDirection: "row", alignItems: "center",
    borderRadius: 14, padding: 16, gap: 12,
  },
  timeText: { fontSize: 20, fontWeight: "bold" },
  saveBtn:     { borderRadius: 16, overflow: "hidden", ...SHADOWS.md },
  saveGradient: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", paddingVertical: 18, gap: 10,
  },
  disabledBtn: { opacity: 0.7 },
  saveText:    { color: "#fff", fontWeight: "bold", fontSize: 18 },
});
