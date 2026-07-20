// M&H App - AI Analysis using Hugging Face
// Token: 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

const HF_API_KEY = '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';
const HF_MODEL = 'Salesforce/blip-image-captioning-large';

async function analyzeImage(base64Image, mimeType) {
    try {
        const byteCharacters = atob(base64Image);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], { type: mimeType });

        const response = await fetch(`https://api-inference.huggingface.co/models/${HF_MODEL}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${HF_API_KEY}`
            },
            body: blob
        });

        if (!response.ok) {
            throw new Error('فشل في تحليل الصورة');
        }

        const result = await response.json();
        
        let analysis = '✨ **تحليل القطعة**\n\n';
        
        if (Array.isArray(result) && result.length > 0) {
            analysis += `**الوصف:** ${result[0].generated_text}\n\n`;
        } else if (result.generated_text) {
            analysis += `**الوصف:** ${result.generated_text}\n\n`;
        }
        
        analysis += '**💡 نصائح الأناقة:**\n';
        analysis += '• يمكنك تنسيق هذه القطعة مع إكسسوارات ذهبية\n';
        analysis += '• الألوان المحايدة تناسب معظم المناسبات\n';
        analysis += '• جربي إضافة حزام أو عقدة لإبراز الخصر\n\n';
        analysis += '**🎨 الألوان المقترحة:**\n';
        analysis += '• بيج، كريمي، أو وردي فاتح\n';
        analysis += '• أسود أو كحلي للمسات كلاسيكية\n\n';
        analysis += '**👠 الإكسسوارات:**\n';
        analysis += '• حذاء بكعب متوسط للمناسبات\n';
        analysis += '• حقيبة صغيرة بلون متناسق\n';
        analysis += '• مجوهرات بسيطة وناعمة\n\n';
        analysis += '💕 **هل تريدين المزيد من التفاصيل؟** اضغطي على "تحدثي مع الخبير"!';
        
        return analysis;
        
    } catch (error) {
        console.error('Error:', error);
        return '⚠️ **عذراً!**\n\nحدث خطأ في تحليل الصورة. يرجى المحاولة مرة أخرى.\n\n**نصائح:**\n• تأكدي من اتصال الإنترنت\n• جربي صورة أوضح\n• تأكدي من أن الصورة تحتوي على قطعة ملابس واضحة\n\n💕 **يمكنك المحاولة مرة أخرى أو التحدث مع الخبير للمساعدة!**';
    }
}

async function chatWithAI(message, context) {
    try {
        const responses = {
            'default': 'مرحباً! أنا خبير الأزياء في M&H. كيف يمكنني مساعدتك اليوم؟ 💕',
            'لون': 'الألوان المحايدة مثل البيج والكريمي تناسب معظم المناسبات. الألوان الزاهية تضيف لمسة من الحيوية! 🎨',
            'تنسيق': 'لتنسيق القطع، حاولي توازن الألوان والأنماط. القطع البسيطة تنسق مع الإكسسوارات الجريئة والعكس صحيح! ✨',
            'حذاء': 'الكعب المتوسط مثالي للمناسبات الرسمية. للمشي الطويل، اختاري كعبًا منخفضًا أو حذاءً مسطحًا أنيقًا. 👠',
            'حقيبة': 'الحقيبة الصغيرة تناسب المناسبات المسائية، بينما الحقيبة المتوسطة عملية للاستخدام اليومي. 👜',
            'مجوهرات': 'المجوهرات البسيطة تضيف لمسة من الأناقة دون مبالغة. الذهبي يناسب الألوان الدافئة والفضي يناسب الألوان الباردة. 💎',
            'فستان': 'الفستان المناسب لجسمك يبرز جمالك. اختاري القصة التي تبرز نقاط قوتك! 👗',
            'بلوزة': 'البلوزة البيضاء كلاسيكية ومتعددة الاستخدامات. يمكنك تنسيقها مع الجينز أو التنورة. 👚',
            'جاكيت': 'الجاكيت المناسب يضيف طبقة من الأناقة. اختاري لونًا متناسقًا مع باقي القطع. 🧥'
        };
        
        const lowerMessage = message.toLowerCase();
        for (const [key, response] of Object.entries(responses)) {
            if (lowerMessage.includes(key)) {
                return response;
            }
        }
        
        return responses['default'];
        
    } catch (error) {
        console.error('Chat Error:', error);
        return 'عذراً، حدث خطأ في المحادثة. يرجى المحاولة مرة أخرى. 💕';
    }
}

function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
            const base64 = reader.result.split(',')[1];
            resolve(base64);
        };
        reader.onerror = error => reject(error);
    });
}

function saveToFavorites(data) {
    let favorites = JSON.parse(localStorage.getItem('mh_favorites') || '[]');
    favorites.push({
        ...data,
        id: Date.now(),
        date: new Date().toLocaleDateString('ar-SA')
    });
    localStorage.setItem('mh_favorites', JSON.stringify(favorites));
}

function shareResults(text) {
    if (navigator.share) {
        navigator.share({
            title: 'تحليل الأناقة من M&H',
            text: text.replace(/<[^>]*>/g, '')
        });
    } else {
        alert('تم نسخ النتائج! يمكنك مشاركتها الآن. 📤');
    }
}
