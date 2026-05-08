import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { Plus, User, MapPin, Clock, Calendar } from 'lucide-react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { schedule as initialSchedule, ScheduleItem } from '../data';

const days = ['الأحد','الاثنين','الثلاثاء','الأربعاء','الخميس'];
const accentColors = ['#1B5E3B','#3B82F6','#8B5CF6','#EA580C','#14B8A6'];

export default function ScheduleScreen() {
  const [schedule, setSchedule] = useState<ScheduleItem[]>(initialSchedule);
  const [activeDay, setActiveDay] = useState('الأحد');
  const [modal, setModal]         = useState(false);
  const [subjectName, setSubjectName] = useState('');
  const [teacher, setTeacher]         = useState('');
  const [day, setDay]                 = useState('الأحد');
  const [startTime, setStartTime]     = useState('');
  const [endTime, setEndTime]         = useState('');
  const [room, setRoom]               = useState('');

  const filtered = schedule.filter(s => s.day === activeDay);

  const addItem = () => {
    if (!subjectName.trim()) return;
    const item: ScheduleItem = {
      id: Date.now().toString(),
      subjectName, teacher, day, startTime, endTime, room,
    };
    setSchedule([...schedule, item]);
    setModal(false);
    setSubjectName(''); setTeacher(''); setStartTime(''); setEndTime(''); setRoom('');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>الجدول الدراسي</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModal(true)}>
            <Plus size={16} color={colors.primaryForeground} strokeWidth={2} />
            <Text style={styles.addBtnText}>إضافة</Text>
          </TouchableOpacity>
        </View>

        {/* Day Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.pills}
        >
          {days.map((d) => (
            <TouchableOpacity
              key={d}
              activeOpacity={0.85}
              onPress={() => setActiveDay(d)}
              style={[styles.pill, activeDay === d && styles.pillActive]}
            >
              <Text style={[styles.pillText, activeDay === d && styles.pillTextActive]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Schedule Cards */}
        {filtered.length === 0 ? (
          <View style={styles.empty}>
            <View style={styles.emptyIcon}>
              <Calendar size={28} color={colors.mutedForeground} strokeWidth={1.5} />
            </View>
            <Text style={styles.emptyText}>لا توجد حصص في هذا اليوم</Text>
          </View>
        ) : (
          <View style={{ gap: spacing.gap }}>
            {filtered.map((item, i) => (
              <View key={item.id} style={[styles.card, { borderRightColor: accentColors[i % 5] }]}>
                <View style={styles.cardRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subName}>{item.subjectName}</Text>
                    {item.teacher ? (
                      <View style={styles.metaRow}>
                        <User size={12} color={colors.mutedForeground} strokeWidth={1.5} />
                        <Text style={styles.metaText}>{item.teacher}</Text>
                      </View>
                    ) : null}
                  </View>
                  <View style={styles.timeBadge}>
                    <Clock size={14} color={colors.primary} strokeWidth={2} />
                    <Text style={styles.timeText}>{item.startTime} - {item.endTime}</Text>
                  </View>
                </View>
                {item.room ? (
                  <View style={[styles.metaRow, { marginTop: 12 }]}>
                    <MapPin size={12} color={colors.mutedForeground} strokeWidth={1.5} />
                    <Text style={styles.metaText}>{item.room}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Modal */}
      <Modal visible={modal} transparent animationType="fade" onRequestClose={() => setModal(false)}>
        <Pressable style={styles.overlay} onPress={() => setModal(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Pressable style={styles.dialog} onPress={() => {}}>
              <Text style={styles.dialogTitle}>إضافة حصة دراسية</Text>

              {/* Day Selector */}
              <Text style={styles.inputLabel}>اليوم</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  {days.map((d) => (
                    <TouchableOpacity
                      key={d}
                      onPress={() => setDay(d)}
                      style={[styles.dayBtn, day === d && styles.dayBtnActive]}
                    >
                      <Text style={[styles.dayBtnText, day === d && styles.dayBtnTextActive]}>{d}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>

              <Field label="اسم المادة"    value={subjectName} onChangeText={setSubjectName} placeholder="الرياضيات" />
              <Field label="اسم المعلم"    value={teacher}     onChangeText={setTeacher}     placeholder="أ. محمد" />
              <Field label="وقت البداية"   value={startTime}   onChangeText={setStartTime}   placeholder="07:30" />
              <Field label="وقت النهاية"   value={endTime}     onChangeText={setEndTime}     placeholder="08:15" />
              <Field label="رقم القاعة"    value={room}        onChangeText={setRoom}        placeholder="قاعة 101" />

              <TouchableOpacity style={styles.submitBtn} onPress={addItem}>
                <Text style={styles.submitText}>إضافة الحصة</Text>
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input} value={value} onChangeText={onChangeText}
        placeholder={placeholder} placeholderTextColor={colors.mutedForeground} textAlign="right"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  content: { paddingBottom: spacing.pageBtm, paddingHorizontal: spacing.pagePad },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: spacing.pageTop, paddingBottom: 16,
  },
  title:    { fontFamily: fonts.bold, fontSize: 24, color: colors.foreground },
  addBtn: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: colors.primary, borderRadius: radius.md,
    paddingHorizontal: 14, paddingVertical: 8,
  },
  addBtnText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primaryForeground },

  pills: { paddingBottom: 8, gap: 8, marginBottom: 20 },
  pill: {
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: radius.md,
    backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border,
  },
  pillActive:     { backgroundColor: colors.primary, borderColor: colors.primary, shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4, elevation: 3 },
  pillText:       { fontFamily: fonts.medium, fontSize: 14, color: colors.mutedForeground },
  pillTextActive: { color: colors.primaryForeground },

  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.card,
    borderWidth: 1, borderColor: 'rgba(229,223,214,0.5)', borderRightWidth: 4,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1,
  },
  cardRow:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  subName:   { fontFamily: fonts.bold, fontSize: 16, color: colors.foreground },
  metaRow:   { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 6 },
  metaText:  { fontFamily: fonts.regular, fontSize: 12, color: colors.mutedForeground },
  timeBadge: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    backgroundColor: 'rgba(27,94,59,0.1)', paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: radius.md,
  },
  timeText: { fontFamily: fonts.medium, fontSize: 12, color: colors.primary, direction: 'ltr' as any },

  empty:      { alignItems: 'center', paddingTop: 64 },
  emptyIcon:  { width: 64, height: 64, backgroundColor: colors.muted, borderRadius: radius.lg, alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  emptyText:  { fontFamily: fonts.medium, fontSize: 16, color: colors.mutedForeground },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  dialog: { width: '90%', backgroundColor: colors.card, borderRadius: radius.xl, padding: 24, maxWidth: 400 },
  dialogTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.foreground, marginBottom: 16, textAlign: 'right' },
  inputLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.foreground, marginBottom: 6, textAlign: 'right' },
  input: {
    height: 40, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 12, fontFamily: fonts.regular, fontSize: 14, color: colors.foreground,
  },
  dayBtn: {
    paddingHorizontal: 16, paddingVertical: 8, borderRadius: radius.md,
    borderWidth: 1, borderColor: colors.border, backgroundColor: 'transparent',
  },
  dayBtnActive:     { backgroundColor: colors.primary, borderColor: colors.primary },
  dayBtnText:       { fontFamily: fonts.medium, fontSize: 12, color: colors.mutedForeground },
  dayBtnTextActive: { color: colors.primaryForeground },
  submitBtn: { width: '100%', backgroundColor: colors.primary, borderRadius: radius.md, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  submitText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primaryForeground },
});
