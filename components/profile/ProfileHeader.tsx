export default function ProfileHeader() {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold text-foreground">Mon profil</h1>
        <p className="text-muted-foreground">
          Gérez vos informations personnelles et les paramètres du compte.
        </p>
      </div>
    </div>
  )
}
