import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity, Modal,
  TextInput, StyleSheet, KeyboardAvoidingView, Platform, Pressable,
} from 'react-native';
import {
  Plus, Clock, AlertCircle, CheckCircle2, Star,
} from 'lucide-react-native';
import { colors, fonts, radius, spacing } from '../theme';
import { assignments as initialAssignments, Assignment } from '../data';

type Tab = 'pending' | 'submitted' | 'graded';

export default function AssignmentsScreen() {
  const [assignments, setAssignments] = useState<Assignment[]>(initialAssignments);
  const [tab, setTab]   = useState<Tab>('pending');
  const [modal, setModal] = useState(false);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [desc, setDesc]   = useState('');
  const [dueDate, setDueDate] = useState('');

  const tabs: { key: Tab; label: string }[] = [
    { key: 'pending',   label: 'معلقة'  },
    { key: 'submitted', label: 'مسلّمة' },
    { key: 'graded',    label: 'مقيّمة' },
  ];

  const filtered = assignments.filter(a => a.status === tab);

  const markSubmitted = (id: string) => {
    setAssignments(prev =>
      prev.map(a => a.id === id ? { ...a, status: 'submitted' } : a)
    );
  };

  const addAssignment = () => {
    if (!title.trim()) return;
    const newA: Assignment = {
      id: Date.now().toString(),
      title, subjectName: subject, subjectId: '0',
      description: desc,
      dueDate: dueDate ? new Date(dueDate) : new Date(),
      status: 'pending',
    };
    setAssignments([...assignments, newA]);
    setModal(false);
    setTitle(''); setSubject(''); setDesc(''); setDueDate('');
  };

  const isOverdue = (a: Assignment) => a.dueDate < new Date() && a.status === 'pending';

  function CardIcon({ a }: { a: Assignment }) {
    if (a.status === 'graded')    return <Star       size={20} color={colors.emerald}      strokeWidth={2} />;
    if (a.status === 'submitted') return <CheckCircle2 size={20} color={colors.blue}        strokeWidth={2} />;
    if (isOverdue(a))             return <AlertCircle size={20} color={colors.destructive}  strokeWidth={2} />;
    return                               <Clock       size={20} color={colors.orange}       strokeWidth={2} />;
  }

  function cardIconBg(a: Assignment) {
    if (a.status === 'graded')    return colors.emeraldBg;
    if (a.status === 'submitted') return colors.blueBg;
    if (isOverdue(a))             return 'rgba(239,68,68,0.1)';
    return colors.orangeBg;
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>المهام والواجبات</Text>
          <TouchableOpacity style={styles.addBtn} onPress={() => setModal(true)}>
            <Plus size={16} color={colors.primaryForeground} strokeWidth={2} />
            <Text style={styles.addBtnText}>إضافة</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={styles.tabBar}>
          {tabs.map((t) => (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabItem, tab === t.key && styles.tabItemActive]}
              onPress={() => setTab(t.key)}
            >
              <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Assignment Cards */}
        <View style={{ gap: spacing.gap }}>
          {filtered.length === 0 ? (
            <Text style={styles.empty}>لا توجد مهام هنا</Text>
          ) : filtered.map((a) => (
            <View key={a.id} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={[styles.iconWrap, { backgroundColor: cardIconBg(a) }]}>
                  <CardIcon a={a} />
                </View>
                <View style={{ flex: 1, minWidth: 0 }}>
                  <Text style={styles.aTitle} numberOfLines={1}>{a.title}</Text>
                  <Text style={styles.aSub}>{a.subjectName}</Text>
                  {a.description ? (
                    <Text style={styles.aDesc} numberOfLines={2}>{a.description}</Text>
                  ) : null}
                  <View style={styles.metaRow}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Clock size={12} color={colors.mutedForeground} strokeWidth={1.5} />
                      <Text style={styles.metaText}>
                        {a.dueDate.toLocaleDateString('ar-SA', { day: 'numeric', month: 'long' })}
                      </Text>
                    </View>
                    {a.status === 'graded' && a.grade ? (
                      <Text style={styles.grade}>{a.grade}/{a.maxGrade}</Text>
                    ) : null}
                  </View>
                </View>
              </View>

              {a.status === 'pending' && (
                <TouchableOpacity
                  style={styles.submitBtn}
                  onPress={() => markSubmitted(a.id)}
                >
                  <CheckCircle2 size={14} color={colors.foreground} strokeWidth={2} />
                  <Text style={styles.submitBtnText}>تم التسليم</Text>
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Modal */}
      <Modal visible={modal} transparent animationType="fade" onRequestClose={() => setModal(false)}>
        <Pressable style={styles.overlay} onPress={() => setModal(false)}>
          <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
            <Pressable style={styles.dialog} onPress={() => {}}>
              <Text style={styles.dialogTitle}>إضافة واجب جديد</Text>
              <Field label="عنوان الواجب"    value={title}   onChangeText={setTitle}   placeholder="مثال: حل تمارين الجبر" />
              <Field label="المادة"           value={subject} onChangeText={setSubject} placeholder="مثال: الرياضيات" />
              <Field label="تاريخ التسليم"   value={dueDate} onChangeText={setDueDate} placeholder="YYYY-MM-DD" keyboardType="numbers-and-punctuation" />
              <Field label="الوصف (اختياري)" value={desc}    onChangeText={setDesc}    placeholder="تفاصيل الواجب..." multiline />
              <TouchableOpacity style={styles.submitModalBtn} onPress={addAssignment}>
                <Text style={styles.submitModalText}>إضافة الواجب</Text>
              </TouchableOpacity>
            </Pressable>
          </KeyboardAvoidingView>
        </Pressable>
      </Modal>
    </View>
  );
}

function Field({ label, value, onChangeText, placeholder, keyboardType, multiline }: any) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 80, textAlignVertical: 'top', paddingTop: 8 }]}
        value={value} onChangeText={onChangeText}
        placeholder={placeholder} placeholderTextColor={colors.mutedForeground}
        textAlign="right" keyboardType={keyboardType} multiline={multiline}
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
    backgroundColor: colors.primary, borderRadius: radius.md, paddingHorizontal: 14, paddingVertical: 8,
  },
  addBtnText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primaryForeground },

  tabBar: {
    flexDirection: 'row', backgroundColor: colors.muted, borderRadius: radius.md,
    padding: 2, height: 44, marginBottom: 20,
  },
  tabItem:       { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10 },
  tabItemActive: { backgroundColor: colors.card, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1 },
  tabText:       { fontFamily: fonts.regular, fontSize: 12, color: colors.mutedForeground },
  tabTextActive: { fontFamily: fonts.medium, fontSize: 12, color: colors.foreground },

  card: {
    backgroundColor: colors.card, borderRadius: radius.lg, padding: spacing.card,
    borderWidth: 1, borderColor: 'rgba(229,223,214,0.5)',
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 1, elevation: 1,
  },
  cardTop:   { flexDirection: 'row', alignItems: 'flex-start', gap: 12 },
  iconWrap:  { width: 40, height: 40, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', flexShrink: 0 },
  aTitle:    { fontFamily: fonts.bold, fontSize: 16, color: colors.foreground },
  aSub:      { fontFamily: fonts.regular, fontSize: 12, color: colors.mutedForeground, marginTop: 2 },
  aDesc:     { fontFamily: fonts.regular, fontSize: 12, color: colors.mutedForeground, marginTop: 4 },
  metaRow:   { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 8 },
  metaText:  { fontFamily: fonts.regular, fontSize: 10, color: colors.mutedForeground },
  grade:     { fontFamily: fonts.bold, fontSize: 10, color: colors.emerald },

  submitBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6,
    borderWidth: 1, borderColor: colors.border, borderRadius: radius.md,
    height: 36, marginTop: 12,
  },
  submitBtnText: { fontFamily: fonts.regular, fontSize: 12, color: colors.foreground },
  empty: { textAlign: 'center', fontFamily: fonts.medium, fontSize: 16, color: colors.mutedForeground, paddingTop: 48 },

  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center' },
  dialog: { width: '90%', backgroundColor: colors.card, borderRadius: radius.xl, padding: 24, maxWidth: 400 },
  dialogTitle: { fontFamily: fonts.bold, fontSize: 18, color: colors.foreground, marginBottom: 16, textAlign: 'right' },
  inputLabel: { fontFamily: fonts.medium, fontSize: 14, color: colors.foreground, marginBottom: 6, textAlign: 'right' },
  input: {
    height: 40, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border,
    paddingHorizontal: 12, fontFamily: fonts.regular, fontSize: 14, color: colors.foreground,
  },
  submitModalBtn: { width: '100%', backgroundColor: colors.primary, borderRadius: radius.md, height: 40, alignItems: 'center', justifyContent: 'center', marginTop: 8 },
  submitModalText: { fontFamily: fonts.medium, fontSize: 14, color: colors.primaryForeground },
});
