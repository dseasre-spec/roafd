import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import { Plus, ChevronLeft, User } from 'lucide-react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { subjects as initialSubjects, Subject } from '../data';

const cardStyles = [
  { bg: 'rgba(27,94,59,0.1)', border: 'rgba(27,94,59,0.2)' },
  { bg: '#EFF6FF',            border: '#BFDBFE' },
  { bg: '#F5F3FF',            border: '#DDD6FE' },
  { bg: '#FFF7ED',            border: '#FED7AA' },
  { bg: '#FFF1F2',            border: '#FECDD3' },
  { bg: '#F0FDFA',            border: '#99F6E4' },
];

const iconOptions = ['📐','📖','🔬','🧮','🌍','🎨','💻','🏃','📝','🧪'];

export default function SubjectsScreen() {
  const [subjects, setSubjects] = useState<Subject[]>(initialSubjects);
  const [modal, setModal]       = useState(false);
  const [icon, setIcon]         = useState('📐');
  const [name, setName]         = useState('');
  const [teacher, setTeacher]   = useState('');
  const [total, setTotal]       = useState('');

  const addSubject = () => {
    if (!name.trim()) return;
    const newSub: Subject = {
      id: Date.now().toString(),
      name, teacher, emoji: icon,
      completedLessons: 0,
      totalLessons: parseInt(total) || 20,
    };
    setSubjects([...subjects, newSub]);
    setModal(false);
    setName(''); setTeacher(''); setTotal(''); setIcon('📐');
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>المواد الدراسية</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModal(true)}>
            <Plus size={16} color={colors.primaryForeground} strokeWidth={2} />
            <Text style={styles.addBtnText}>إضافة</Text>
          </TouchableOpacity>
        </View>

        {/* Cards */}
        <View style={{ gap: spacing.gap }}>
          {subjects.map((s, i) => {
            const style = cardStyles[i % 6];
            const pct   = Math.round((s.completedLessons / s.totalLessons) * 100);
            return (
              <TouchableOpacity
                key={s.id}
                activeOpacity={0.85}
                style={[styles.card, { backgroundColor: style.bg, borderColor: style.border }]}
              >
                <View style={styles.cardTop}>
                  <Text style={styles.emoji}>{s.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.subName}>{s.name}</Text>
                    <View style={styles.teacherRow}>
                      <User size={12} color={colors.mutedForeground} strokeWidth={1.5} />
                      <Text style={styles.teacherText}>{s.teacher}</Text>
                    </View>
                  </View>
                  <ChevronLeft size={20} color={colors.mutedForeground} strokeWidth={1.5} />
                </View>
                <View style={{ marginTop: 12 }}>
                  <View style={styles.progRow}>
                    <Text style={styles.progMeta}>{s.completedLessons} / {s.totalLessons} درس</Text>
                    <Text style={styles.progMeta}>{pct}%</Text>
                  </View>
                  <View style={styles.progTrack}>
                    <View style={[styles.progFill, { width: `${pct}%` as any }]} />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Add Modal */}
      <Modal visible={modal} transparent animationType="fade" onRequestClose={() => setModal(false)}>
        <Pressable style={styles.overlay} onPress={() => setModal(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Pressable style={styles.dialog} onPress={() => {}}>
              <Text style={styles.dialogTitle}>إضافة مادة جديدة</Text>

              {/* Icon Selector */}
              <Text style={styles.inputLabel}>اختر الأيقونة</Text>
              <View style={styles.iconGrid}>
                {iconOptions.map((ic) => (
                  <TouchableOpacity
                    key={ic}
                    style={[styles.iconBtn, icon === ic && styles.iconBtnSelected]}
                    onPress={() => setIcon(ic)}
                  >
                    <Text style={{ fontSize: 18 }}>{ic}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Field label="اسم المادة"     value={name}    onChangeText={setName}    placeholder="مثال: الرياضيات" />
              <Field label="اسم المعلم"     value={teacher} onChangeText={setTeacher} placeholder="مثال: أ. محمد العمري" />
              <Field label="عدد الدروس"    value={total}   onChangeText={setTotal}   placeholder="مثال: 20" keyboardType="numeric" />

              <TouchableOpacity style={styles.submitBtn} onPress={addSubject}>
                <Text style={styles.submitText}>إضافة المادة</Text>
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        textAlign="right"
        keyboardType={keyboardType}
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
    shadowColor: '#000', shadowOpacity: 0.07, shadowRadius: 4, elevation: 3,
  },
  addBtnText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primaryForeground },

  card: {
    borderRadius: radius.lg, padding: spacing.card, borderWidth: 1,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1,
  },
  cardTop:     { flexDirection: 'row', alignItems: 'center', gap: 12 },
  emoji:       { fontSize: 24 },
  subName:     { fontFamily: fonts.bold, fontSize: 16, color: colors.foreground },
  teacherRow:  { flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 },
  teacherText: { fontFamily: fonts.regular, fontSize: 12, color: colors.mutedForeground },
  progRow:     { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  progMeta:    { fontFamily: fonts.regular, fontSize: 12, color: colors.mutedForeground },
  progTrack:   { height: 8, backgroundColor: 'rgba(255,255,255,0.6)', borderRadius: radius.full, overflow: 'hidden' },
  progFill:    { height: 8, backgroundColor: colors.primary, borderRadius: radius.full },

  overlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.8)',
    justifyContent: 'center', alignItems: 'center',
  },
  dialog: {
    width: '90%', backgroundColor: colors.card, borderRadius: radius.xl,
    padding: 24, maxWidth: 400,
  },
  dialogTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.foreground, marginBottom: 16, textAlign: 'right' },
  iconGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 },
  iconBtn: {
    width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center',
    borderWidth: 2, borderColor: colors.border,
  },
  iconBtnSelected: { borderColor: colors.primary, backgroundColor: 'rgba(27,94,59,0.1)' },
  inputLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.foreground, marginBottom: 6, textAlign: 'right' },
  input: {
    height: 40, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 12, fontFamily: fonts.regular, fontSize: 14, color: colors.foreground,
  },
  submitBtn: {
    width: '100%', backgroundColor: colors.primary, borderRadius: radius.md,
    height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 8,
  },
  submitText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primaryForeground },
});
