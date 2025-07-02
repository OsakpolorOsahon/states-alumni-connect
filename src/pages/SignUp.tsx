// src/pages/SignUp.tsx

-import React, { useState, useEffect } from 'react';
-import { useNavigate } from 'react-router-dom';
-import { Button } from '@/components/ui/button';
-import { Input } from '@/components/ui/input';
-import { Label } from '@/components/ui/label';
-import {
-  Select,
-  SelectContent,
-  SelectItem,
-  SelectTrigger,
-  SelectValue
-} from '@/components/ui/select';
-import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
-import { useAuth } from '@/contexts/AuthContext';
-import { useToast } from '@/hooks/use-toast';
-import Navigation from '@/components/Navigation';
-import Footer from '@/components/Footer';
-import PasswordInput from '@/components/PasswordInput';
-import {
-  STATESHIP_YEARS,
-  MOWCUB_POSITIONS,
-  COUNCIL_OFFICES
-} from '@/data/memberData';
+import React, { useState, useEffect } from 'react';
+import { useNavigate } from 'react-router-dom';
+import { Button } from '@/components/ui/button';
+import { Input } from '@/components/ui/input';
+import { Label } from '@/components/ui/label';
+import {
+  Select,
+  SelectContent,
+  SelectItem,
+  SelectTrigger,
+  SelectValue
+} from '@/components/ui/select';
+import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
+import { useAuth } from '@/contexts/AuthContext';
+import { supabase } from '@/lib/supabaseClient';  // ← import supabase client
+import { useToast } from '@/hooks/use-toast';
+import Navigation from '@/components/Navigation';
+import Footer from '@/components/Footer';
+import PasswordInput from '@/components/PasswordInput';
+import {
+  STATESHIP_YEARS,
+  MOWCUB_POSITIONS,
+  COUNCIL_OFFICES
+} from '@/data/memberData';

 const SignUp = () => {
   const navigate = useNavigate();
-  const { signUp, supabase } = useAuth();
+  const { signUp } = useAuth();             // ← remove supabase destructure
   const { toast } = useToast();
   const [loading, setLoading] = useState(false);
   const [photoFile, setPhotoFile] = useState<File | null>(null);
   const [duesFile, setDuesFile] = useState<File | null>(null);
   const [formData, setFormData] = useState({
     email: '',
     password: '',
     confirmPassword: '',
     fullName: '',
     nickname: '',
     stateshipYear: '',
     lastPosition: '',
     councilOffice: 'None',
-    photoUrl: '',
-    duesProofUrl: '',
+    // remove photoUrl/duesProofUrl from formData; we handle uploads separately
     latitude: null as number | null,
     longitude: null as number | null
   });

   // Get user's location
   useEffect(() => {
@@ handleSubmit = async (e) => {
     e.preventDefault();

     // 1) Validate passwords
     if (formData.password !== formData.confirmPassword) {
@@
     // 2) Validate files selected
     if (!photoFile || !duesFile) {
       toast({
         title: "Error",
         description: "Please select both a profile photo and a dues proof file",
         variant: "destructive"
       });
       return;
     }

     setLoading(true);

     try {
-      // 3) Sign up (creates user)
-      const { data: authData, error: authError } = await supabase.auth.signUp({
-        email: formData.email,
-        password: formData.password
-      });
-      if (authError || !authData.user) {
-        throw authError || new Error('Auth signUp failed');
-      }
-      const userId = authData.user.id;
+      // 3) Sign up (creates user)
+      const result = await signUp(formData.email, formData.password, formData);
+      if (result.error || !result.user) {
+        throw result.error || new Error('Sign-up failed');
+      }
+      const userId = result.user.id;

       // 4) Upload profile photo
       const { data: photoData, error: photoErr } = await supabase
         .storage
         .from("member-files")
         .upload(`photos/${userId}/${Date.now()}-${photoFile.name}`, photoFile);
       if (photoErr || !photoData?.path) throw photoErr || new Error('Photo upload failed');
       const photoUrl = supabase
         .storage
         .from("member-files")
         .getPublicUrl(photoData.path).publicUrl;

       // 5) Upload dues proof
       const { data: duesData, error: duesErr } = await supabase
         .storage
         .from("member-files")
         .upload(`dues/${userId}/${Date.now()}-${duesFile.name}`, duesFile);
       if (duesErr || !duesData?.path) throw duesErr || new Error('Dues upload failed');
       const duesUrl = supabase
         .storage
         .from("member-files")
         .getPublicUrl(duesData.path).publicUrl;

       // 6) Insert member record
       const { error: dbError } = await supabase
         .from("members")
         .insert([{
           user_id: userId,
           full_name: formData.fullName,
           nickname: formData.nickname,
           stateship_year: formData.stateshipYear,
           last_mowcub_position: formData.lastPosition,
           current_council_office: formData.councilOffice,
-          photo_url: photoUrl,
-          dues_proof_url: duesUrl,
+          photo_url: photoUrl,
+          dues_proof_url: duesUrl,
           latitude: formData.latitude,
           longitude: formData.longitude,
           status: "Pending"
         }]);
       if (dbError) throw dbError;

       // 7) Success
       toast({
         title: "Sign Up Successful",
         description: "Please check your email to verify your account, then wait for approval."
       });
       navigate('/pending-approval');

     } catch (error: any) {
       toast({
         title: "Error",
         description: error.message || "An unexpected error occurred",
         variant: "destructive"
       });
     } finally {
       setLoading(false);
     }
   };

   return (
     <div className="min-h-screen bg-background">
       <Navigation />
       <div className="container mx-auto py-12 px-4">
         <div className="max-w-2xl mx-auto">
           <Card>
             <CardHeader>
               <CardTitle className="text-2xl font-bold text-center">Join SMMOWCUB</CardTitle>
               <p className="text-center text-muted-foreground">
                 Create your account to apply for membership
               </p>
             </CardHeader>
             <CardContent>
               <form onSubmit={handleSubmit} className="space-y-6">
                 {/* Basic Information */}
                 <!-- rest of JSX unchanged -->