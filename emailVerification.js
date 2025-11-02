const STUDENT_SUBDOMAINS = ['aid', 'coed', 'med', 'eced', 'eved', 'ced', 'ched'];
const ADMIN_DOMAIN_SUFFIX = '@adm.svnit.ac.in';
const WARDEN_DOMAIN_SUFFIX = '@warden.svnit.ac.in';
const CORE_DOMAIN = '.svnit.ac.in';

// Regex for student emails only (e.g., u24cs150@coed.svnit.ac.in)
const STUDENT_SUBDOMAIN_PATTERN = `(${STUDENT_SUBDOMAINS.join('|')})`;
const STUDENT_EMAIL_REGEX = new RegExp(`^[\\S]+@${STUDENT_SUBDOMAIN_PATTERN}\\${CORE_DOMAIN}$`);

// Database for Student IDs (Only Students) - checks first 8 characters
const STUDENT_USER_DATABASE = {
    'aid': { 'u24ai101': 'student', 'u24ai102': 'student' },
    'coed': { 'u24cs150': 'student', 'u24cs153': 'student' },
    'med': { 'u24me201': 'student' },
    'eced': { 'u24ec301': 'student' },
    'eved': { 'u24ee401': 'student' },
    'ced': { 'u24ce501': 'student' },
    'ched': { 'u24ch601': 'student' }
};

// Database for Admin Usernames (Entire username is the ID) - Domain: @adm.svnit.ac.in
const ADMIN_USER_DATABASE = {
    'adm1': 'admin',
    'adm2': 'admin',
    'registrar_head': 'admin',
    'finance_controller': 'admin'
};

// Database for Warden Usernames (Entire username is the ID) - Domain: @warden.svnit.ac.in
const WARDEN_USER_DATABASE = {
    'warden1': 'warden',
    'warden2': 'warden',
    'hostel_incharge_men': 'warden',
    'hostel_incharge_women': 'warden'
};

function isValidSVNITEmail(email) {
    if (!email || typeof email !== 'string') {
        console.error("Input must be a non-empty string.");
        return false;
    }

    const normalizedEmail = email.trim().toLowerCase();

    // --- CASE 1: ADMIN CHECK (@adm.svnit.ac.in) ---
    if (normalizedEmail.endsWith(ADMIN_DOMAIN_SUFFIX)) {
        const username = normalizedEmail.split('@')[0];
        const userRole = ADMIN_USER_DATABASE[username];

        if (userRole === 'admin') {
            console.log(`Validation succeeded: Email '${email}' is valid. User Role: ADMIN`);
            return userRole;
        } else {
            console.log(`Validation failed (Admin Database): Username '${username}' not found in Admin database.`);
            return false;
        }
    }

    // --- CASE 2: WARDEN CHECK (@warden.svnit.ac.in) ---
    if (normalizedEmail.endsWith(WARDEN_DOMAIN_SUFFIX)) {
        const username = normalizedEmail.split('@')[0];
        const userRole = WARDEN_USER_DATABASE[username];

        if (userRole === 'warden') {
            console.log(`Validation succeeded: Email '${email}' is valid. User Role: WARDEN`);
            return userRole;
        } else {
            console.log(`Validation failed (Warden Database): Username '${username}' not found in Warden database.`);
            return false;
        }
    }

    // --- CASE 3: STUDENT CHECK (Departmental Subdomains) ---
    if (STUDENT_EMAIL_REGEX.test(normalizedEmail)) {
        const parts = normalizedEmail.split('@');
        const username = parts[0];
        const subdomain = parts[1].split('.')[0];
        const baseId = username.substring(0, 8);

        const departmentDatabase = STUDENT_USER_DATABASE[subdomain];

        if (!departmentDatabase || departmentDatabase[baseId] !== 'student') {
             console.log(`Validation failed (Student Database): Base ID '${baseId}' not found in '${subdomain}' database or role is incorrect.`);
            return false;
        }

        console.log(`Validation succeeded: Email '${email}' is valid. User Role: STUDENT`);
        return 'student';
    }

    // --- FINAL FALLBACK ---
    console.log(`Validation failed (Structural): Email '${email}' does not match any valid domain pattern.`);
    return false;
}

console.log(`\n--- Successful Validations & Role Lookups ---`);
console.log(`Student (COED): ${isValidSVNITEmail("u24cs150@coed.svnit.ac.in")}`);
console.log(`Admin (Central): ${isValidSVNITEmail("finance_controller@adm.svnit.ac.in")}`);
console.log(`Warden (Central): ${isValidSVNITEmail("warden1@warden.svnit.ac.in")}`);

console.log(`\n--- Failed Validations ---`);
console.log(`Fail (Structural - Wrong Subdomain): ${isValidSVNITEmail("u24cs150@ece.svnit.ac.in")}`);
console.log(`Fail (Admin DB - Unknown User): ${isValidSVNITEmail("adm99@adm.svnit.ac.in")}`);
console.log(`Fail (Student DB - Unknown ID): ${isValidSVNITEmail("u24cs999@coed.svnit.ac.in")}`);
console.log(`Fail (Structural - Invalid format): ${isValidSVNITEmail("other@gmail.com")}`);

module.exports = { isValidSVNITEmail };
