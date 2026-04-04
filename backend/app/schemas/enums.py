from enum import StrEnum


class PrimaryGoal(StrEnum):
    fitness = "fitness"
    career = "career"
    discipline = "discipline"
    healing = "healing"
    confidence = "confidence"
    study = "study"


class Tone(StrEnum):
    calm = "calm"
    intense = "intense"
    spiritual = "spiritual"
    practical = "practical"
    stoic = "stoic"


class QuoteLength(StrEnum):
    short = "short"
    medium = "medium"


class Category(StrEnum):
    discipline = "discipline"
    healing = "healing"
    fitness = "fitness"
    career = "career"
    grief = "grief"
    study = "study"
    loneliness = "loneliness"
    self_respect = "self-respect"
    resilience = "resilience"
